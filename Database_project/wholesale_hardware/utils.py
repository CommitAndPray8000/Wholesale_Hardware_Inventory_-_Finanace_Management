from datetime import timedelta, date
from django.utils import timezone
from django.contrib.auth.models import User
from wholesale_hardware.models import (
    StockItem,
    StockItemUnit,
    ClientsAndVendors,
    PartyType,
    ApprovedVendorItem,
    Owner,
    CashierAccountant,
)
from cashier_accountant.models import (
    PurchaseOrder,
    SaleInvoice,
    SaleItem,
)


def seed_demo_data_if_needed():
    """Seeds initial stock, clients, vendors, and transactions if empty."""
    if StockItem.objects.exists() and ClientsAndVendors.objects.exists():
        return

    # 1. Ensure Owner and Cashier exist with profiles
    owner_user, _ = User.objects.get_or_create(
        username="owner", defaults={"email": "owner@standardtraders.pk", "is_superuser": True, "is_staff": True}
    )
    if not owner_user.has_usable_password() or not owner_user.check_password("owner123"):
        owner_user.set_password("owner123")
        owner_user.save()
    Owner.objects.get_or_create(user=owner_user)

    cashier_user, _ = User.objects.get_or_create(
        username="cashier", defaults={"email": "cashier@standardtraders.pk", "is_staff": True}
    )
    if not cashier_user.has_usable_password() or not cashier_user.check_password("cashier123"):
        cashier_user.set_password("cashier123")
        cashier_user.save()
    CashierAccountant.objects.get_or_create(user=cashier_user)

    # 2. Seed Vendors and Clients
    v1, _ = ClientsAndVendors.objects.get_or_create(
        client_name="Apex Logistics & Hardware",
        defaults={
            "party_type": PartyType.VENDOR,
            "phone": "0300-1122334",
            "client_city": "KH",
            "client_area": "ST",
            "address": "Plot 42, SITE Industrial Area, Karachi",
            "ntn_number": "4129841-2",
            "payable_balance": 45000.00,
        },
    )

    v2, _ = ClientsAndVendors.objects.get_or_create(
        client_name="Crown Industrial Tools Ltd",
        defaults={
            "party_type": PartyType.VENDOR,
            "phone": "0321-4455667",
            "client_city": "LH",
            "address": "Circular Road, Badami Bagh, Lahore",
            "ntn_number": "8721345-9",
            "payable_balance": 0.00,
        },
    )

    c1, _ = ClientsAndVendors.objects.get_or_create(
        client_name="Ali Construction Ltd",
        defaults={
            "party_type": PartyType.CLIENT,
            "phone": "0333-7788990",
            "client_city": "KH",
            "client_area": "DH",
            "address": "Phase 6 Commercial, DHA, Karachi",
            "receivable_balance": 85000.00,
        },
    )

    c2, _ = ClientsAndVendors.objects.get_or_create(
        client_name="Walk-in Cash Customer",
        defaults={
            "party_type": PartyType.CLIENT,
            "phone": "0300-0000000",
            "client_city": "KH",
            "client_area": "SD",
            "address": "Retail Counter, Saddar, Karachi",
            "receivable_balance": 0.00,
        },
    )

    # 3. Seed Stock Items
    items_data = [
        {
            "name": "Steel Claw Hammer 16oz (Fiberglass Handle)",
            "item_code": "HAM-9941",
            "category": "Hand Tools",
            "current_quantity": 48,
            "low_stock_threshold": 15,
            "unit": "PCS",
            "purchase_price": 550.00,
            "selling_price": 750.00,
            "min_selling_price": 680.00,
        },
        {
            "name": "DeWalt 20V Cordless Hammer Drill Kit",
            "item_code": "DRL-4402",
            "category": "Power Tools",
            "current_quantity": 12,
            "low_stock_threshold": 5,
            "unit": "PCS",
            "purchase_price": 28500.00,
            "selling_price": 34000.00,
            "min_selling_price": 31500.00,
        },
        {
            "name": "Heavy Duty Industrial Steel Shelf Rack 4-Tier",
            "item_code": "RCK-8822",
            "category": "Storage & Shelving",
            "current_quantity": 8,
            "low_stock_threshold": 10,
            "unit": "PCS",
            "purchase_price": 32000.00,
            "selling_price": 39500.00,
            "min_selling_price": 36000.00,
        },
        {
            "name": "Galvanized Wood Screws #8 x 2-inch (Box of 500)",
            "item_code": "SCR-1205",
            "category": "Fasteners",
            "current_quantity": 95,
            "low_stock_threshold": 25,
            "unit": "BOX",
            "purchase_price": 1200.00,
            "selling_price": 1650.00,
            "min_selling_price": 1450.00,
        },
        {
            "name": "Industrial Pallet Hand Truck 2.5 Ton",
            "item_code": "PLT-5520",
            "category": "Material Handling",
            "current_quantity": 4,
            "low_stock_threshold": 3,
            "unit": "PCS",
            "purchase_price": 42000.00,
            "selling_price": 51000.00,
            "min_selling_price": 47000.00,
        },
    ]

    created_items = []
    for idata in items_data:
        item, _ = StockItem.objects.get_or_create(item_code=idata["item_code"], defaults=idata)
        created_items.append(item)

    # 4. Approve initial item-vendor pairings for Owner & Cashier
    # Approved: Steel Claw Hammer <-> Apex Logistics
    ApprovedVendorItem.objects.get_or_create(
        item=created_items[0],
        vendor=v1,
        defaults={"negotiated_price": 550.00, "approved_by": owner_user, "is_active": True},
    )
    # Approved: Galvanized Screws <-> Apex Logistics
    ApprovedVendorItem.objects.get_or_create(
        item=created_items[3],
        vendor=v1,
        defaults={"negotiated_price": 1200.00, "approved_by": owner_user, "is_active": True},
    )
    # Approved: Cordless Drill <-> Crown Industrial Tools
    ApprovedVendorItem.objects.get_or_create(
        item=created_items[1],
        vendor=v2,
        defaults={"negotiated_price": 28500.00, "approved_by": owner_user, "is_active": True},
    )

    now = timezone.now()

    # 5. Create Sample Sales Invoices across time slots
    # Today's sale
    inv1, created = SaleInvoice.objects.get_or_create(
        invoice_number="INV-2026-0001",
        defaults={
            "client": c2,
            "cashier": cashier_user,
            "subtotal": 1500.00,
            "total_amount": 1500.00,
            "amount_paid": 1500.00,
            "payment_method": "CASH",
            "payment_status": "PAID",
            "created_at": now - timedelta(hours=2),
        },
    )
    if created:
        SaleItem.objects.create(
            invoice=inv1, item=created_items[0], unit="PCS", quantity=2, unit_price=750.00, total_price=1500.00
        )

    # Weekly sale (4 days ago)
    inv2, created = SaleInvoice.objects.get_or_create(
        invoice_number="INV-2026-0002",
        defaults={
            "client": c1,
            "cashier": cashier_user,
            "subtotal": 68000.00,
            "total_amount": 68000.00,
            "amount_paid": 68000.00,
            "payment_method": "BANK",
            "payment_status": "PAID",
            "created_at": now - timedelta(days=4),
        },
    )
    if created:
        SaleItem.objects.create(
            invoice=inv2, item=created_items[1], unit="PCS", quantity=2, unit_price=34000.00, total_price=68000.00
        )

    # Monthly sale (18 days ago)
    inv3, created = SaleInvoice.objects.get_or_create(
        invoice_number="INV-2026-0003",
        defaults={
            "client": c1,
            "cashier": cashier_user,
            "subtotal": 39500.00,
            "total_amount": 39500.00,
            "amount_paid": 0.00,
            "payment_method": "CREDIT",
            "payment_status": "UNPAID",
            "created_at": now - timedelta(days=18),
        },
    )
    if created:
        SaleItem.objects.create(
            invoice=inv3, item=created_items[2], unit="PCS", quantity=1, unit_price=39500.00, total_price=39500.00
        )

    # 6. Create Sample Purchase Orders across time slots
    # Today's PO
    po1, created = PurchaseOrder.objects.get_or_create(
        id=1,
        defaults={
            "item": created_items[0],
            "vendor": v1,
            "quantity": 20,
            "unit_cost_price": 550.00,
            "placed_by": cashier_user,
            "status": "ORDERED",
            "created_at": now - timedelta(hours=3),
        },
    )
    # Weekly PO (5 days ago)
    po2, created = PurchaseOrder.objects.get_or_create(
        id=2,
        defaults={
            "item": created_items[1],
            "vendor": v2,
            "quantity": 5,
            "unit_cost_price": 28500.00,
            "placed_by": owner_user,
            "status": "RECEIVED",
            "created_at": now - timedelta(days=5),
        },
    )
    # Monthly PO (20 days ago)
    po3, created = PurchaseOrder.objects.get_or_create(
        id=3,
        defaults={
            "item": created_items[3],
            "vendor": v1,
            "quantity": 50,
            "unit_cost_price": 1200.00,
            "placed_by": cashier_user,
            "status": "RECEIVED",
            "created_at": now - timedelta(days=20),
        },
    )
