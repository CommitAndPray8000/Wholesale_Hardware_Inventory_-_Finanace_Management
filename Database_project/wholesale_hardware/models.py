from django.db import models

class StockItem(models.Model):
    name = models.CharField(max_length=255)
    item_code = models.CharField(max_length=100, unique=True, help_text="Item code or SKU")
    category = models.CharField(max_length=100, default="Hardware")
    supplier = models.CharField(max_length=255, default="Apex Logistics")
    current_quantity = models.IntegerField(default=0, help_text="Available stock units on hand")
    low_stock_threshold = models.IntegerField(default=15, help_text="Low-stock threshold")
    ordered_quantity = models.IntegerField(default=0, help_text="Units currently ordered/pending delivery")
    delivered_quantity = models.IntegerField(default=0, help_text="Units historically delivered")
    purchase_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text="Cost/Purchase price per unit in PKR")
    selling_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text="Selling price per unit in PKR")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['id']

    @property
    def inventory_status(self):
        if self.current_quantity <= 0:
            return "Out of Stock"
        elif self.current_quantity <= self.low_stock_threshold:
            return "Low Stock"
        else:
            return "In Stock"

    @property
    def is_ordered(self):
        return self.ordered_quantity > 0

    @property
    def statuses(self):
        result = [self.inventory_status]
        if self.is_ordered:
            result.append("Ordered")
        return result

    @property
    def status(self):
        return ", ".join(self.statuses)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "item_code": self.item_code,
            "sku": self.item_code,
            "category": self.category,
            "supplier": self.supplier,
            "current_quantity": self.current_quantity,
            "stock": self.current_quantity,
            "inStock": f"{self.current_quantity} pcs",
            "low_stock_threshold": self.low_stock_threshold,
            "ordered_quantity": self.ordered_quantity,
            "delivered_quantity": self.delivered_quantity,
            "purchase_price": float(self.purchase_price),
            "price": float(self.purchase_price),
            "selling_price": float(self.selling_price),
            "inventory_status": self.inventory_status,
            "is_ordered": self.is_ordered,
            "statuses": self.statuses,
            "status": self.status,
        }

    def __str__(self):
        return f"{self.item_code} - {self.name}"

class Order(models.Model):
    item = models.ForeignKey(StockItem, on_delete=models.CASCADE, related_name="orders")
    quantity = models.PositiveIntegerField(help_text="Units to order")
    supplier = models.CharField(max_length=255)
    note = models.TextField(blank=True, default="", help_text="Optional order notes")
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="Ordered")

    class Meta:
        ordering = ['-created_at']

    def to_dict(self):
        return {
            "id": self.id,
            "item_id": self.item.id,
            "item_name": self.item.name,
            "item_code": self.item.item_code,
            "quantity": self.quantity,
            "supplier": self.supplier,
            "note": self.note,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M"),
            "status": self.status,
        }

    def __str__(self):
        return f"Order #{self.id} - {self.quantity}x {self.item.name}"
