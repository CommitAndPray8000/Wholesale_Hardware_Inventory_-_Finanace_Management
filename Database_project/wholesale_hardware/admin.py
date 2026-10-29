from django.contrib import admin
from .models import StockItem, Order

@admin.register(StockItem)
class StockItemAdmin(admin.ModelAdmin):
    list_display = ('item_code', 'name', 'category', 'current_quantity', 'ordered_quantity', 'purchase_price', 'selling_price', 'status')
    search_fields = ('item_code', 'name', 'supplier', 'category')
    list_filter = ('category', 'supplier')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'item', 'quantity', 'supplier', 'status', 'created_at')
    search_fields = ('item__name', 'item__item_code', 'supplier', 'note')
    list_filter = ('status', 'created_at')
