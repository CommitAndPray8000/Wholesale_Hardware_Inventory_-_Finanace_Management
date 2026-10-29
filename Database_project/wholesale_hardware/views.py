import json
import time
from datetime import datetime
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import StockItem, Order

def seed_initial_stock_items():
    """Populates default items in the database if empty, with PKR pricing."""
    if StockItem.objects.exists():
        return

    defaults = [
        {
            "name": "Heavy Duty Steel Rack",
            "item_code": "SKU-9941",
            "category": "Storage & Shelving",
            "supplier": "Apex Logistics",
            "current_quantity": 24,
            "low_stock_threshold": 15,
            "ordered_quantity": 0,
            "delivered_quantity": 24,
            "purchase_price": 38500.00,
            "selling_price": 45000.00,
        },
        {
            "name": "Industrial Pallet Box",
            "item_code": "SKU-8822",
            "category": "Material Handling",
            "supplier": "Global Pack Co.",
            "current_quantity": 12,
            "low_stock_threshold": 15,
            "ordered_quantity": 0,
            "delivered_quantity": 12,
            "purchase_price": 9800.00,
            "selling_price": 12500.00,
        },
        {
            "name": "Barcode Scanner Pro",
            "item_code": "SKU-4402",
            "category": "Warehouse Tech",
            "supplier": "TechTrack Solutions",
            "current_quantity": 0,
            "low_stock_threshold": 10,
            "ordered_quantity": 15,
            "delivered_quantity": 0,
            "purchase_price": 48000.00,
            "selling_price": 58000.00,
        },
        {
            "name": "Thermal Label Roll",
            "item_code": "SKU-3120",
            "category": "Packaging & Labels",
            "supplier": "Zebra Supplies",
            "current_quantity": 140,
            "low_stock_threshold": 30,
            "ordered_quantity": 0,
            "delivered_quantity": 140,
            "purchase_price": 3600.00,
            "selling_price": 4800.00,
        },
        {
            "name": "Heavy Duty Air Compressor",
            "item_code": "SKU-5520",
            "category": "Power Tools",
            "supplier": "Bostitch Tools",
            "current_quantity": 0,
            "low_stock_threshold": 5,
            "ordered_quantity": 0,
            "delivered_quantity": 5,
            "purchase_price": 72000.00,
            "selling_price": 89000.00,
        },
    ]

    for item_data in defaults:
        StockItem.objects.create(**item_data)

def index(request):
    """Renders the wholesale hardware central operations portal with live DB stock data."""
    seed_initial_stock_items()
    items = StockItem.objects.all()
    items_json = [i.to_dict() for i in items]
    return render(request, 'index.html', {
        'db_stock_items': items,
        'db_stock_items_json': json.dumps(items_json),
    })

@csrf_exempt
def api_stock_items(request):
    """GET list of default stock items or simulate POST new stock item in-memory."""
    seed_initial_stock_items()
    if request.method == 'GET':
        items = [i.to_dict() for i in StockItem.objects.all()]
        return JsonResponse({"success": True, "items": items})

    elif request.method == 'POST':
        try:
            data = json.loads(request.body) if request.body else request.POST
            name = data.get('name', '').strip()
            item_code = data.get('item_code') or data.get('sku', '').strip()
            category = data.get('category', 'Hardware').strip()
            supplier = data.get('supplier', 'Apex Logistics').strip()
            current_quantity = int(data.get('current_quantity') or data.get('inStock', 0) or 0)
            low_stock_threshold = int(data.get('low_stock_threshold', 15))
            purchase_price = float(data.get('purchase_price') or data.get('price', 0.0))
            selling_price = float(data.get('selling_price') or (purchase_price * 1.25))

            if not name or not item_code:
                return JsonResponse({"success": False, "error": "Item Name and Item Code/SKU are required"}, status=400)

            # In-memory testing mode: return simulated item without saving to database
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
    if request.method != 'POST':
        return JsonResponse({"success": False, "error": "POST method required"}, status=405)

    try:
        data = json.loads(request.body) if request.body else request.POST
        item_id = data.get('item_id')
        item_code = data.get('item_code') or data.get('sku')
        quantity = int(data.get('quantity', 0))
        supplier = data.get('supplier', '').strip()
        note = data.get('note', '').strip()

        if quantity <= 0:
            return JsonResponse({"success": False, "error": "Quantity must be greater than zero"}, status=400)

        item = None
        if item_id:
            item = StockItem.objects.filter(id=item_id).first()
        if not item and item_code:
            item = StockItem.objects.filter(item_code__iexact=item_code).first()

        item_name = item.name if item else (item_code or "Selected Item")

        # In-memory testing mode: return simulated success without persisting changes
        return JsonResponse({
            "success": True,
            "message": f"Successfully placed order for {quantity} units of '{item_name}'. (In-memory testing mode)",
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
                "ordered_quantity": ((item.ordered_quantity if item else 0) + quantity),
            },
        })

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)
