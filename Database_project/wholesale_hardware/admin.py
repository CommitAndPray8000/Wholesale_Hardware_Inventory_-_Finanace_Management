from django.contrib import admin
from .models import (
    StockItem,
    StockItemUnit,
    ClientsAndVendors,
    ApprovedVendorItem,
    ExpenseCategory,
    Expense,
    DailyFinancialSummary,
    Order,
    Owner,
    CashierAccountant,
    WarehouseManager,
    Worker,
)


class StockItemUnitInline(admin.TabularInline):
    model = StockItemUnit
    extra = 1
    fields = ("unit", "pcs_per_unit", "is_base_unit")


class ApprovedVendorItemInline(admin.TabularInline):
    model = ApprovedVendorItem
    extra = 1
    fields = ("vendor", "negotiated_price", "is_active", "notes")


@admin.register(StockItem)
class StockItemAdmin(admin.ModelAdmin):
    list_display = (
        "item_code",
        "name",
        "category",
        "current_quantity",
        "unit",
        "purchase_price",
        "selling_price",
        "status",
    )
    search_fields = ("item_code", "name", "category")
    list_filter = ("category", "unit")
    inlines = [StockItemUnitInline, ApprovedVendorItemInline]


@admin.register(StockItemUnit)
class StockItemUnitAdmin(admin.ModelAdmin):
    list_display = ("id", "item", "unit", "pcs_per_unit", "is_base_unit")
    search_fields = ("item__name", "item__item_code", "unit")
    list_filter = ("unit", "is_base_unit")


@admin.register(ClientsAndVendors)
class ClientsAndVendorsAdmin(admin.ModelAdmin):
    list_display = (
        "client_name",
        "party_type",
        "client_city",
        "phone",
        "receivable_balance",
        "payable_balance",
        "is_active",
    )
    list_filter = ("party_type", "client_city", "is_active")
    search_fields = ("client_name", "phone", "email", "ntn_number")


@admin.register(ApprovedVendorItem)
class ApprovedVendorItemAdmin(admin.ModelAdmin):
    list_display = ("item", "vendor", "negotiated_price", "is_active", "approved_by", "created_at")
    list_filter = ("is_active", "created_at")
    search_fields = ("item__name", "item__item_code", "vendor__client_name")


@admin.register(ExpenseCategory)
class ExpenseCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "amount", "expense_date", "paid_to", "payment_method", "logged_by")
    list_filter = ("category", "payment_method", "expense_date")
    search_fields = ("title", "paid_to__client_name", "notes")


@admin.register(DailyFinancialSummary)
class DailyFinancialSummaryAdmin(admin.ModelAdmin):
    list_display = (
        "report_date",
        "total_revenue",
        "cost_of_goods_sold",
        "gross_profit",
        "total_expenses",
        "net_profit",
        "cash_in_hand",
    )
    search_fields = ("report_date", "notes")
    readonly_fields = ("gross_profit", "net_profit")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "item", "quantity", "supplier", "status", "created_at")
    search_fields = ("item__name", "item__item_code", "supplier", "note")
    list_filter = ("status", "created_at")


@admin.register(Owner)
class OwnerAdmin(admin.ModelAdmin):
    list_display = ("id", "user")
    search_fields = ("user__username", "user__first_name", "user__last_name", "user__email")


@admin.register(CashierAccountant)
class CashierAccountantAdmin(admin.ModelAdmin):
    list_display = ("id", "user")
    search_fields = ("user__username", "user__first_name", "user__last_name", "user__email")


@admin.register(WarehouseManager)
class WarehouseManagerAdmin(admin.ModelAdmin):
    list_display = ("id", "user")
    search_fields = ("user__username", "user__first_name", "user__last_name", "user__email")


@admin.register(Worker)
class WorkerAdmin(admin.ModelAdmin):
    list_display = ("id", "user")
    search_fields = ("user__username", "user__first_name", "user__last_name", "user__email")
