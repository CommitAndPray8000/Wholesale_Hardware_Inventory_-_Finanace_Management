import json
import random
from datetime import timedelta
from decimal import Decimal
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Sum, F
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import csrf_exempt
from wholesale_hardware.models import (
    StockItem,
    ClientsAndVendors,
    PartyType,
    ApprovedVendorItem,
)
from wholesale_hardware.utils import seed_demo_data_if_needed
from .models import (
    PurchaseOrder,
    SaleInvoice,
    SaleItem,
    CustomerPayment,
    DailyCashRegister,
)


def get_slot_date_filter(slot):
    """Returns datetime filter start threshold for given time slot."""
    now = timezone.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    if slot == "today":
        return today_start
    elif slot == "weekly":
        return now - timedelta(days=7)
    elif slot == "monthly":
        return now - timedelta(days=30)
    elif slot == "yearly":
        return now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    elif slot == "inception":
        return None
    return today_start


def cashier_portal(request):
    """
    Renders the dedicated Cashier Operations Portal.
    Accessible to Cashiers and Owners.
    Features:
    1. Make Restock Order (with Cashier authorization rules)
    2. Record Sale (POS invoice with live stock deduction)
    3. Check Inventory
    4. Sales & Purchases list filtered by time slot (today, weekly, monthly, yearly, since inception)
    """
    if not request.user.is_authenticated:
        return redirect("/login/?next=/cashier/portal/&info=login_required")

    seed_demo_data_if_needed()

    current_slot = request.GET.get("slot", "today").lower()
    if current_slot not in ["today", "weekly", "monthly", "yearly", "inception"]:
        current_slot = "today"

    start_date = get_slot_date_filter(current_slot)

    # Filter Sales
    sales_qs = SaleInvoice.objects.select_related("client", "cashier").prefetch_related("items__item")
    if start_date:
        sales_qs = sales_qs.filter(created_at__gte=start_date)
    sales = list(sales_qs.order_by("-created_at")[:100])

    # Filter Purchases
    purchases_qs = PurchaseOrder.objects.select_related("item", "vendor", "placed_by")
    if start_date:
        purchases_qs = purchases_qs.filter(created_at__gte=start_date)
    purchases = list(purchases_qs.order_by("-created_at")[:100])

    # Summary Metrics
    total_sales_val = sum(s.total_amount for s in sales)
    total_purchases_val = sum(p.quantity * p.unit_cost_price for p in purchases)

    # Core lists for form dropdowns
    stock_items = StockItem.objects.all().order_by("name")
    vendors = ClientsAndVendors.objects.filter(
        party_type__in=[PartyType.VENDOR, PartyType.BOTH], is_active=True
    ).order_by("client_name")
    clients = ClientsAndVendors.objects.filter(
        party_type__in=[PartyType.CLIENT, PartyType.BOTH], is_active=True
    ).order_by("client_name")

    approved_pairs = list(
        ApprovedVendorItem.objects.filter(is_active=True).values(
            "item_id", "vendor_id", "negotiated_price"
        )
    )

    alert_msg = request.GET.get("msg")
    banner_info = None
    if alert_msg == "owner_restricted":
        banner_info = "Access Note: Full Operations Dashboard is reserved for the Owner. You are in the Cashier Portal."

    context = {
        "user": request.user,
        "is_owner": request.user.is_superuser or hasattr(request.user, "owner_profile"),
        "current_slot": current_slot,
        "sales": sales,
        "purchases": purchases,
        "total_sales_val": total_sales_val,
        "total_purchases_val": total_purchases_val,
        "sales_count": len(sales),
        "purchases_count": len(purchases),
        "stock_items": stock_items,
        "vendors": vendors,
        "clients": clients,
        "approved_pairs_json": json.dumps(approved_pairs, default=float),
        "banner_info": banner_info,
    }
    return render(request, "cashier_accountant/portal.html", context)



def api_cashier_order(request):
    """
    POST: Cashier places a restock purchase order.
    Enforces business rules via PurchaseOrder.clean():
    - Re-ordering previously ordered item from existing vendor -> ALLOWED
    - Ordering a brand new item -> BLOCKED for cashier
    - Ordering an existing item from a new vendor for the first time -> BLOCKED for cashier
    - Owner -> Full authority
    """
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "POST method required"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "error": "Authentication required"}, status=401)

    try:
        data = json.loads(request.body) if request.body else request.POST
        item_id = data.get("item_id")
        vendor_id = data.get("vendor_id")
        quantity = int(data.get("quantity", 0))
        unit_cost = Decimal(str(data.get("unit_cost_price", "0.00")))
        note = data.get("note", "").strip()

        if quantity <= 0:
            return JsonResponse({"success": False, "error": "Order quantity must be at least 1"}, status=400)

        item = StockItem.objects.filter(id=item_id).first()
        if not item:
            return JsonResponse({"success": False, "error": "Selected Stock Item not found"}, status=404)

        vendor = ClientsAndVendors.objects.filter(id=vendor_id).first()
        if not vendor:
            return JsonResponse({"success": False, "error": "Selected Vendor not found"}, status=404)

        if unit_cost <= 0:
            unit_cost = item.purchase_price

        # Instantiate PurchaseOrder and run validation
        po = PurchaseOrder(
            item=item,
            vendor=vendor,
            quantity=quantity,
            unit_cost_price=unit_cost,
            placed_by=request.user,
            note=note,
            status="ORDERED",
        )
        po.full_clean()
        po.save()

        return JsonResponse({
            "success": True,
            "message": f"Purchase Order #{po.id} successfully placed for {po.quantity}x '{item.name}' with '{vendor.client_name}'.",
            "order": po.to_dict(),
        })

    except ValidationError as ve:
        err_dict = ve.message_dict if hasattr(ve, "message_dict") else {"error": ve.messages}
        # Flatten primary message
        primary_msg = ""
        for field, msgs in err_dict.items():
            primary_msg += " ".join(msgs) + " "
        return JsonResponse({
            "success": False,
            "error": primary_msg.strip(),
            "validation_errors": err_dict,
        }, status=400)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)



def api_cashier_sale(request):
    """
    POST: Cashier records customer sale and issues sale invoice.
    Deducts stock immediately from inventory and updates customer ledger if credit.
    """
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "POST method required"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "error": "Authentication required"}, status=401)

    try:
        data = json.loads(request.body) if request.body else request.POST
        client_id = data.get("client_id")
        item_id = data.get("item_id")
        quantity = int(data.get("quantity", 1))
        unit_price = Decimal(str(data.get("unit_price", "0.00")))
        payment_method = data.get("payment_method", "CASH").upper()
        payment_status = data.get("payment_status", "PAID").upper()
        notes = data.get("notes", "").strip()

        if quantity <= 0:
            return JsonResponse({"success": False, "error": "Sale quantity must be at least 1"}, status=400)

        item = StockItem.objects.filter(id=item_id).first()
        if not item:
            return JsonResponse({"success": False, "error": "Stock item not found"}, status=404)

        client = ClientsAndVendors.objects.filter(id=client_id).first()
        if not client:
            return JsonResponse({"success": False, "error": "Customer not found"}, status=404)

        # Stock check
        available = item.current_quantity or 0
        if available < quantity:
            return JsonResponse({
                "success": False,
                "error": f"Insufficient stock! Requested: {quantity} {item.unit}, but only {available} {item.unit} available on hand.",
            }, status=400)

        if unit_price <= 0:
            unit_price = item.selling_price

        total_amount = Decimal(str(quantity)) * unit_price
        amount_paid = total_amount if payment_status == "PAID" else Decimal("0.00")

        # Generate unique invoice number
        inv_count = SaleInvoice.objects.count() + 1
        invoice_number = f"INV-{timezone.now().strftime('%Y%m')}-{inv_count:04d}"

        invoice = SaleInvoice.objects.create(
            invoice_number=invoice_number,
            client=client,
            cashier=request.user,
            subtotal=total_amount,
            discount_amount=Decimal("0.00"),
            total_amount=total_amount,
            amount_paid=amount_paid,
            payment_method=payment_method,
            payment_status=payment_status,
            notes=notes,
        )

        SaleItem.objects.create(
            invoice=invoice,
            item=item,
            unit=item.unit,
            quantity=quantity,
            unit_price=unit_price,
            total_price=total_amount,
        )

        # Deduct stock
        item.current_quantity = available - quantity
        item.save()

        # Update client credit balance if unpaid
        if payment_status in ["UNPAID", "PARTIAL"]:
            due = total_amount - amount_paid
            client.receivable_balance = (client.receivable_balance or Decimal("0.00")) + due
            client.save()

        return JsonResponse({
            "success": True,
            "message": f"Sale Invoice {invoice.invoice_number} successfully recorded for PKR {total_amount:,.2f}. Stock updated.",
            "invoice": {
                "id": invoice.id,
                "invoice_number": invoice.invoice_number,
                "client_name": client.client_name,
                "item_name": item.name,
                "quantity": quantity,
                "unit": item.unit,
                "total_amount": float(total_amount),
                "remaining_stock": item.current_quantity,
                "created_at": invoice.created_at.strftime("%Y-%m-%d %H:%M"),
            },
        })

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)


def api_cashier_history(request):
    """
    GET: Returns JSON sales and purchases list filtered by time slot.
    Allows seamless client-side tab switching for Today, Weekly, Monthly, Yearly, and Since Inception.
    """
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "error": "Authentication required"}, status=401)

    slot = request.GET.get("slot", "today").lower()
    start_date = get_slot_date_filter(slot)

    # Sales
    sales_qs = SaleInvoice.objects.select_related("client", "cashier").prefetch_related("items__item")
    if start_date:
        sales_qs = sales_qs.filter(created_at__gte=start_date)
    sales = sales_qs.order_by("-created_at")[:100]

    sales_data = []
    total_sales_val = Decimal("0.00")
    for s in sales:
        total_sales_val += s.total_amount
        first_item = s.items.first()
        item_summary = f"{first_item.quantity}x {first_item.item.name}" if first_item else "General items"
        sales_data.append({
            "id": s.id,
            "invoice_number": s.invoice_number,
            "client_name": s.client.client_name,
            "items_summary": item_summary,
            "total_amount": float(s.total_amount),
            "amount_paid": float(s.amount_paid),
            "payment_method": s.get_payment_method_display(),
            "payment_status": s.get_payment_status_display(),
            "status_code": s.payment_status,
            "created_at": s.created_at.strftime("%Y-%m-%d %H:%M"),
        })

    # Purchases
    purchases_qs = PurchaseOrder.objects.select_related("item", "vendor", "placed_by")
    if start_date:
        purchases_qs = purchases_qs.filter(created_at__gte=start_date)
    purchases = purchases_qs.order_by("-created_at")[:100]

    purchases_data = []
    total_purchases_val = Decimal("0.00")
    for p in purchases:
        cost = p.quantity * p.unit_cost_price
        total_purchases_val += cost
        purchases_data.append({
            "id": p.id,
            "item_name": p.item.name,
            "item_code": p.item.item_code,
            "vendor_name": p.vendor.client_name,
            "quantity": p.quantity,
            "unit": p.item.unit,
            "unit_cost_price": float(p.unit_cost_price),
            "total_cost": float(cost),
            "status": p.status,
            "placed_by": p.placed_by.username if p.placed_by else "System",
            "created_at": p.created_at.strftime("%Y-%m-%d %H:%M"),
        })

    return JsonResponse({
        "success": True,
        "slot": slot,
        "total_sales_val": float(total_sales_val),
        "total_purchases_val": float(total_purchases_val),
        "sales_count": len(sales_data),
        "purchases_count": len(purchases_data),
        "sales": sales_data,
        "purchases": purchases_data,
    })


def api_cashier_inventory(request):
    """GET: Returns live stock items for inventory check."""
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "error": "Authentication required"}, status=401)

    items = [
        {
            "id": item.id,
            "item_code": item.item_code,
            "name": item.name,
            "category": item.category,
            "current_quantity": item.current_quantity,
            "unit": item.unit,
            "selling_price": float(item.selling_price),
            "status": item.inventory_status,
        }
        for item in StockItem.objects.all().order_by("name")
    ]
    return JsonResponse({"success": True, "items": items})
