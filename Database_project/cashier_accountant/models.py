from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from wholesale_hardware.models import (
    StockItem,
    StockItemUnit,
    ClientsAndVendors,
    PartyType,
    ApprovedVendorItem,
)


class PurchaseOrder(models.Model):
    """
    Purchase Orders placed to restock inventory from vendors.
    Business Rule Enforcement:
    - Cashiers CAN re-order items that have been ordered before from the same vendor.
    - Cashiers CANNOT order new items (never ordered before).
    - Cashiers CANNOT order an existing item from a new/different vendor for the first time.
    - Owners have full authority to order any item from any vendor.
    """
    STATUS_CHOICES = [
        ("ORDERED", "Ordered / In Transit"),
        ("RECEIVED", "Received / Delivered"),
        ("CANCELLED", "Cancelled"),
    ]

    item = models.ForeignKey(
        StockItem,
        on_delete=models.CASCADE,
        related_name="cashier_purchase_orders",
        help_text="Stock item to purchase",
    )
    vendor = models.ForeignKey(
        ClientsAndVendors,
        on_delete=models.CASCADE,
        related_name="cashier_vendor_orders",
        limit_choices_to={"party_type__in": [PartyType.VENDOR, PartyType.BOTH]},
        help_text="Vendor/Supplier to order from",
    )
    quantity = models.PositiveIntegerField(help_text="Units to order (in base PCS)")
    unit_cost_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text="Cost price per unit in PKR",
    )
    placed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="placed_orders",
        help_text="User (Cashier or Owner) placing this order",
    )
    note = models.TextField(blank=True, default="", help_text="Optional order notes")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="ORDERED")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Purchase Order"
        verbose_name_plural = "Purchase Orders"

    def clean(self):
        super().clean()

        if not self.item_id or not self.vendor_id:
            return

        # Check if the user placing the order is the Owner or superuser
        is_owner = False
        if self.placed_by:
            if self.placed_by.is_superuser or hasattr(self.placed_by, "owner_profile"):
                is_owner = True

        # Restrict Cashiers / Non-Owners
        if not is_owner:
            # 1. Check if (item, vendor) pair is explicitly pre-approved by the Owner
            is_approved = ApprovedVendorItem.objects.filter(
                item=self.item,
                vendor=self.vendor,
                is_active=True,
            ).exists()

            # 2. Check if this specific item has been previously ordered from this same vendor
            prior_vendor_orders = PurchaseOrder.objects.filter(
                item=self.item,
                vendor=self.vendor,
                status__in=["ORDERED", "RECEIVED"],
            )
            if self.pk:
                prior_vendor_orders = prior_vendor_orders.exclude(pk=self.pk)

            has_ordered_from_this_vendor_before = prior_vendor_orders.exists()

            if not (is_approved or has_ordered_from_this_vendor_before):
                # Has this item EVER been ordered from ANY vendor before?
                item_ordered_ever = (
                    PurchaseOrder.objects.filter(
                        item=self.item, status__in=["ORDERED", "RECEIVED"]
                    ).exists()
                    or ApprovedVendorItem.objects.filter(item=self.item).exists()
                )

                if not item_ordered_ever:
                    raise ValidationError({
                        "item": (
                            f"Restricted: Item '{self.item.name}' has never been ordered before. "
                            f"Cashiers cannot introduce new items. "
                            f"New items must first be ordered and approved by the Owner."
                        )
                    })
                else:
                    raise ValidationError({
                        "vendor": (
                            f"Restricted: Item '{self.item.name}' has never been ordered from vendor "
                            f"'{self.vendor.client_name}' before. "
                            f"Cashiers cannot order an existing item from a new vendor for the first time. "
                            f"Owner approval is required to approve this vendor for this item."
                        )
                    })

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

        # If an Owner places the order, auto-register/update this (item, vendor) pair in ApprovedVendorItem
        if self.placed_by and (self.placed_by.is_superuser or hasattr(self.placed_by, "owner_profile")):
            ApprovedVendorItem.objects.get_or_create(
                item=self.item,
                vendor=self.vendor,
                defaults={
                    "negotiated_price": self.unit_cost_price,
                    "approved_by": self.placed_by,
                    "is_active": True,
                },
            )

    def to_dict(self):
        return {
            "id": self.id,
            "item_id": self.item.id,
            "item_name": self.item.name,
            "item_code": self.item.item_code,
            "vendor_id": self.vendor.id,
            "vendor_name": self.vendor.client_name,
            "quantity": self.quantity,
            "unit_cost_price": float(self.unit_cost_price),
            "total_cost": float(self.quantity * self.unit_cost_price),
            "placed_by": self.placed_by.username if self.placed_by else "System",
            "status": self.status,
            "note": self.note,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M"),
        }

    def __str__(self):
        return f"PO #{self.id} - {self.quantity}x {self.item.name} from {self.vendor.client_name}"


class SaleInvoice(models.Model):
    """
    Sales Invoices generated by the Cashier for customer purchases.
    """
    PAYMENT_METHODS = [
        ("CASH", "Cash"),
        ("BANK", "Bank Transfer"),
        ("CHEQUE", "Cheque"),
        ("CREDIT", "Credit / Ledger (Udhar)"),
    ]

    PAYMENT_STATUS = [
        ("PAID", "Fully Paid"),
        ("PARTIAL", "Partially Paid"),
        ("UNPAID", "Unpaid / On Credit"),
    ]

    invoice_number = models.CharField(
        max_length=50, unique=True, help_text="e.g. INV-2026-0001"
    )
    client = models.ForeignKey(
        ClientsAndVendors,
        on_delete=models.PROTECT,
        related_name="sales_invoices",
        limit_choices_to={"party_type__in": [PartyType.CLIENT, PartyType.BOTH]},
        help_text="Customer / Client",
    )
    cashier = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="processed_invoices",
    )
    subtotal = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    amount_paid = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default="CASH")
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="PAID")
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Sale Invoice"
        verbose_name_plural = "Sale Invoices"

    def __str__(self):
        return f"{self.invoice_number} - {self.client.client_name} (PKR {self.total_amount})"


class SaleItem(models.Model):
    """
    Line items on a Sale Invoice.
    """
    invoice = models.ForeignKey(SaleInvoice, on_delete=models.CASCADE, related_name="items")
    item = models.ForeignKey(StockItem, on_delete=models.PROTECT, related_name="sales")
    unit = models.CharField(max_length=10, default="PCS")
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    total_price = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} {self.unit} x {self.item.name} for {self.invoice.invoice_number}"


class CustomerPayment(models.Model):
    """
    Payment receipts when a client clears credit / ledger dues.
    """
    PAYMENT_METHODS = [
        ("CASH", "Cash"),
        ("BANK", "Bank Transfer"),
        ("CHEQUE", "Cheque"),
        ("ONLINE", "Online / Digital"),
    ]

    client = models.ForeignKey(
        ClientsAndVendors,
        on_delete=models.PROTECT,
        related_name="payments_made",
        limit_choices_to={"party_type__in": [PartyType.CLIENT, PartyType.BOTH]},
    )
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default="CASH")
    reference_no = models.CharField(
        max_length=100, blank=True, default="", help_text="Cheque # or Bank Txn ID"
    )
    received_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="received_customer_payments"
    )
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Customer Payment"
        verbose_name_plural = "Customer Payments"

    def __str__(self):
        return f"Payment PKR {self.amount} from {self.client.client_name}"


class DailyCashRegister(models.Model):
    """
    Shift / Daily drawer balance management for Cashiers.
    """
    cashier = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cash_registers")
    date = models.DateField()
    opening_balance = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    cash_sales = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    cash_received_from_credit = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    cash_paid_expenses = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    expected_closing_balance = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    actual_closing_balance = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    discrepancy = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    is_closed = models.BooleanField(default=False)
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("cashier", "date")
        ordering = ["-date"]
        verbose_name = "Daily Cash Register"
        verbose_name_plural = "Daily Cash Registers"

    def __str__(self):
        return f"Register {self.date} - {self.cashier.username}"
