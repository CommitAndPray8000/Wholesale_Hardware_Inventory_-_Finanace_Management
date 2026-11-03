from django.urls import path
from . import views

app_name = "cashier_accountant"

urlpatterns = [
    path("portal/", views.cashier_portal, name="portal"),
    path("api/order/", views.api_cashier_order, name="api_order"),
    path("api/sale/", views.api_cashier_sale, name="api_sale"),
    path("api/history/", views.api_cashier_history, name="api_history"),
    path("api/inventory/", views.api_cashier_inventory, name="api_inventory"),
]
