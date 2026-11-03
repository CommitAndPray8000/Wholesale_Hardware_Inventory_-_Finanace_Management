from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.static import serve
from wholesale_hardware import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.welcome, name="welcome"),
    path("login/", views.login_portal, name="login_portal"),
    path("logout/", views.logout_view, name="logout_view"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("cashier/", include("cashier_accountant.urls")),
    path("api/stock-items/", views.api_stock_items, name="api_stock_items"),
    path("api/orders/", views.api_order_create, name="api_order_create"),
    path("welcome.css", serve, {"document_root": settings.BASE_DIR.parent / "frontend", "path": "welcome.css"}),
    path("assets/<path:path>", serve, {"document_root": settings.BASE_DIR.parent / "assets"}),
    path("app.js", serve, {"document_root": settings.BASE_DIR.parent, "path": "app.js"}),
    path("styles.css", serve, {"document_root": settings.BASE_DIR.parent, "path": "styles.css"}),
]

urlpatterns += staticfiles_urlpatterns()
