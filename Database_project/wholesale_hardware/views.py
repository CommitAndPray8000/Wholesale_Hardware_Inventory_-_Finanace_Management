import json
import time
from datetime import datetime
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from .models import StockItem, Order, ClientsAndVendors, Owner, CashierAccountant
from .utils import seed_demo_data_if_needed


def welcome(request):
    """Renders the standalone welcome landing page for Standard Traders."""
    return render(request, "welcome.html")


def login_portal(request):
    """
    Renders the dedicated Admin & Cashier login portal.
    Authenticates user and redirects according to role:
    - Owner -> Full Dashboard (/dashboard/)
    - Cashier -> Cashier Operations Portal (/cashier/portal/)
    """
    seed_demo_data_if_needed()

    # If already logged in, route immediately
    if request.user.is_authenticated:
        if request.user.is_superuser or hasattr(request.user, "owner_profile"):
            return redirect("/dashboard/")
        elif hasattr(request.user, "cashier_profile"):
            return redirect("/cashier/portal/")
        return redirect("/dashboard/")

    error_message = None
    info_message = None
    if request.GET.get("info") == "logged_out":
        info_message = "You have been securely signed out."
    elif request.GET.get("info") == "login_required":
        info_message = "Please sign in to access the system."

    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "").strip()
        next_url = request.POST.get("next") or request.GET.get("next")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)

            is_owner = user.is_superuser or hasattr(user, "owner_profile")
            is_cashier = hasattr(user, "cashier_profile")

            if is_owner:
                target = next_url if (next_url and "/cashier/" not in next_url) else "/dashboard/"
                return redirect(target)
            elif is_cashier:
                return redirect("/cashier/portal/")
            else:
                return redirect("/dashboard/")
        else:
            error_message = "Invalid username or password. Please check your credentials."

    return render(request, "login.html", {
        "error_message": error_message,
        "info_message": info_message,
        "next_url": request.GET.get("next", ""),
    })


def logout_view(request):
    """Signs out the current user session and redirects to login portal."""
    logout(request)
    return redirect("/login/?info=logged_out")


def dashboard(request):
    """
    Renders the wholesale hardware central operations portal with live DB stock data.
    Restricted to Owner only! Cashiers are redirected to the Cashier Portal.
    """
    if not request.user.is_authenticated:
        return redirect("/login/?next=/dashboard/&info=login_required")

    is_owner = request.user.is_superuser or hasattr(request.user, "owner_profile")
    if not is_owner:
        return redirect("/cashier/portal/?msg=owner_restricted")

    seed_demo_data_if_needed()
    items = StockItem.objects.prefetch_related("units").all()
    items_json = [i.to_dict() for i in items]
    return render(request, "wholesale_hardware/dashboard.html", {
        "db_stock_items": items,
        "db_stock_items_json": json.dumps(items_json),
        "current_user": request.user,
    })


@csrf_exempt
def api_stock_items(request):
    """GET list of stock items or simulate POST new stock item in-memory."""
    if request.method == "GET":
        items = [i.to_dict() for i in StockItem.objects.all()]
        return JsonResponse({"success": True, "items": items})

    elif request.method == "POST":
        try:
            data = json.loads(request.body) if request.body else request.POST
            name = data.get("name", "").strip()
            item_code = data.get("item_code") or data.get("sku", "").strip()
            category = data.get("category", "Hardware").strip()
            supplier = data.get("supplier", "Apex Logistics").strip()
            current_quantity = int(data.get("current_quantity") or data.get("inStock", 0) or 0)
            low_stock_threshold = int(data.get("low_stock_threshold", 15))
            purchase_price = float(data.get("purchase_price") or data.get("price", 0.0))
            selling_price = float(data.get("selling_price") or (purchase_price * 1.25))

            if not name or not item_code:
                return JsonResponse({"success": False, "error": "Item Name and Item Code/SKU are required"}, status=400)

            mock_item = {
                "id": int(time.time() * 1000),
                "name": name,
                "item_code": item_code,
                "sku": item_code,
                "category": category,
                "supplier": supplier,
                "current_quantity": current_quantity,
                "stock": current_quantity,
                "inStock": f"{current_quantity} pcs",
                "low_stock_threshold": low_stock_threshold,
                "ordered_quantity": 0,
                "delivered_quantity": current_quantity,
                "purchase_price": purchase_price,
                "price": purchase_price,
                "selling_price": selling_price,
                "inventory_status": "In Stock" if current_quantity > low_stock_threshold else ("Low Stock" if current_quantity > 0 else "Out of Stock"),
                "is_ordered": False,
                "statuses": ["In Stock" if current_quantity > low_stock_threshold else ("Low Stock" if current_quantity > 0 else "Out of Stock")],
                "status": "In Stock" if current_quantity > low_stock_threshold else ("Low Stock" if current_quantity > 0 else "Out of Stock"),
            }
            return JsonResponse({"success": True, "item": mock_item}, status=201)
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
def api_order_create(request):
    """
    POST: Place an order for an item in-memory testing mode without database write.
    """
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "POST method required"}, status=405)

    try:
        data = json.loads(request.body) if request.body else request.POST
        item_id = data.get("item_id")
        item_code = data.get("item_code") or data.get("sku")
        quantity = int(data.get("quantity", 0))
        supplier = data.get("supplier", "").strip()
        note = data.get("note", "").strip()

        if quantity <= 0:
            return JsonResponse({"success": False, "error": "Quantity must be greater than zero"}, status=400)

        item = None
        if item_id:
            item = StockItem.objects.filter(id=item_id).first()
        if not item and item_code:
            item = StockItem.objects.filter(item_code__iexact=item_code).first()

        item_name = item.name if item else (item_code or "Selected Item")

        return JsonResponse({
            "success": True,
            "message": f"Successfully placed order for {quantity} units of '{item_name}'.",
            "order": {
                "id": int(time.time() * 1000),
                "item_id": item.id if item else 0,
                "item_name": item_name,
                "item_code": item_code,
                "quantity": quantity,
                "supplier": supplier or "Apex Logistics",
                "note": note,
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
                "status": "Ordered",
            },
            "item": {
                "item_code": item_code,
                "ordered_quantity": ((item.ordered_quantity if item and hasattr(item, "ordered_quantity") else 0) + quantity),
            },
        })

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)
