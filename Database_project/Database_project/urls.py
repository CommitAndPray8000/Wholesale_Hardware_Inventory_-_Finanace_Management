from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.views.static import serve
from wholesale_hardware import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('api/stock-items/', views.api_stock_items, name='api_stock_items'),
    path('api/orders/', views.api_order_create, name='api_order_create'),
    path('app.js', serve, {'document_root': settings.BASE_DIR.parent, 'path': 'app.js'}),
    path('styles.css', serve, {'document_root': settings.BASE_DIR.parent, 'path': 'styles.css'}),
]

