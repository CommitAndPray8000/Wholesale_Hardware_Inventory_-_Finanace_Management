from django.contrib import admin
from .models import (
    PurchaseOrder,
    SaleInvoice,
    SaleItem,
    CustomerPayment,
    DailyCashRegister,
)


class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 1
    fields = ("item", "unit", "quantity", "unit_price", "total_price")
    readonly_fields = ("total_price",)


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "item",
        "vendor",
        "quantity",
        "unit_cost_price",
        "placed_by",
        "status",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = ("item__name", "item__item_code", "vendor__client_name", "note")


@admin.register(SaleInvoice)
class SaleInvoiceAdmin(admin.ModelAdmin):
    list_display = (
        "invoice_number",
        "client",
        "cashier",
        "total_amount",
        "amount_paid",
        "payment_method",
        "payment_status",
        "created_at",
    )
    list_filter = ("payment_status", "payment_method", "created_at")
    search_fields = ("invoice_number", "client__client_name", "notes")
    inlines = [SaleItemInline]


@admin.register(CustomerPayment)
class CustomerPaymentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "client",
        "amount",
        "payment_method",
        "reference_no",
        "received_by",
        "created_at",
    )
    list_filter = ("payment_method", "created_at")
    search_fields = ("client__client_name", "reference_no", "notes")


@admin.register(DailyCashRegister)
class DailyCashRegisterAdmin(admin.ModelAdmin):
    list_display = (
        "date",
        "cashier",
        "opening_balance",
        "cash_sales",
        "cash_paid_expenses",
        "expected_closing_balance",
        "actual_closing_balance",
        "discrepancy",
        "is_closed",
    )
    list_filter = ("is_closed", "date")
    search_fields = ("cashier__username", "notes")
