from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class UnitChoice(models.TextChoices):  # We can select the multiple units of item and any composite unit must be equal to multiple single type units.
    PCS = "PCS", "Pieces (PCS)"
    DZN = "DZN", "Dozen (DZN)"
    CTN = "CTN", "Carton (CTN)"
    BOX = "BOX", "Box (BOX)"
    PKT = "PKT", "Packet (PKT)"
    GROSS = "GROSS", "Gross (GROSS)"
    ROLL = "ROLL", "Roll (ROLL)"


class StockItem(models.Model):
    name = models.CharField(max_length=255)
    item_code = models.CharField(
        max_length=100, unique=True, help_text="Item code or SKU"
    )
    category = models.CharField(max_length=100, default="Hardware")
    current_quantity = models.IntegerField(
        default=0,
        help_text="Available stock units on hand (in base unit/PCS)",
        null=True,
        blank=True,
    )
    low_stock_threshold = models.IntegerField(
        default=15, help_text="Low-stock threshold", null=True, blank=True
    )
    unit = models.CharField(
        max_length=10,
        choices=UnitChoice.choices,
        default=UnitChoice.PCS,
        help_text="Base/Primary unit (default PCS)",
    )
    purchase_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text="Cost/Purchase price per unit in PKR",
    )
    selling_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text="Selling price per unit in PKR",
    )
    min_selling_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text="Minimum selling price per unit in PKR",
        null=True,
        blank=True,
    )
    expiry_date = models.DateField(
        null=True, blank=True, help_text="Expiry date (optional)"
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]

    @property
    def inventory_status(self):
        qty = self.current_quantity or 0
        threshold = self.low_stock_threshold or 0
        if qty <= 0:
            return "Out of Stock"
        elif qty <= threshold:
            return "Low Stock"
        else:
            return "In Stock"

    @property
    def is_ordered(self):
        return (getattr(self, "ordered_quantity", 0) or 0) > 0

    @property
    def statuses(self):
        result = [self.inventory_status]
        if self.is_ordered:
            result.append("Ordered")
        return result

    @property
    def status(self):
        return ", ".join(self.statuses)

    def get_unit_factor(self, unit_name):
        """
        Returns the conversion factor (how many PCS are in 1 unit of unit_name).
        Checks custom units first, then standard defaults (DZN=12, GROSS=144, PCS=1).
        """
        unit_obj = self.units.filter(unit=unit_name).first()
        if unit_obj:
            return float(unit_obj.pcs_per_unit)

        # Standard known defaults
        if unit_name == UnitChoice.DZN:
            return 12.0
        elif unit_name == UnitChoice.GROSS:
            return 144.0
        elif unit_name == UnitChoice.PCS:
            return 1.0
        return 1.0

    def convert_quantity(self, quantity, from_unit, to_unit):
        """
        Converts quantity between any two configured units for this item.
        Example: convert_quantity(2, 'BOX', 'DZN') where 1 BOX = 24 PCS -> 4.0 DZN
        """
        from_factor = self.get_unit_factor(from_unit)
        to_factor = self.get_unit_factor(to_unit)
        if to_factor == 0:
            return 0.0
        pcs = float(quantity) * from_factor
        return pcs / to_factor

    def get_quantity_in(self, unit_name):
        """Returns the current stock quantity expressed in the requested unit."""
        qty = self.current_quantity or 0
        return self.convert_quantity(qty, UnitChoice.PCS, unit_name)

    def set_quantity_from(self, quantity, unit_name):
        """Updates current_quantity (stored in base PCS) from a quantity in unit_name."""
        factor = self.get_unit_factor(unit_name)
        self.current_quantity = int(round(float(quantity) * factor))

    def to_dict(self):
        units_list = [
            {
                "unit": u.unit,
                "label": u.get_unit_display(),
                "pcs_per_unit": float(u.pcs_per_unit),
                "is_base_unit": u.is_base_unit,
                "stock_in_unit": round(
                    self.convert_quantity(
                        self.current_quantity or 0, UnitChoice.PCS, u.unit
                    ),
                    2,
                ),
            }
            for u in self.units.all()
        ]
        return {
            "id": self.id,
            "name": self.name,
            "item_code": self.item_code,
            "sku": self.item_code,
            "category": self.category,
            "supplier": getattr(self, "supplier", "Apex Logistics"),
            "current_quantity": self.current_quantity,
            "stock": self.current_quantity,
            "unit": self.unit,
            "units": units_list,
            "inStock": f"{self.current_quantity or 0} {self.unit}",
            "low_stock_threshold": self.low_stock_threshold,
            "ordered_quantity": getattr(self, "ordered_quantity", 0),
            "delivered_quantity": getattr(self, "delivered_quantity", 0),
            "purchase_price": float(self.purchase_price),
            "price": float(self.purchase_price),
            "selling_price": float(self.selling_price),
            "min_selling_price": float(self.min_selling_price)
            if self.min_selling_price
            else 0.0,
            "expiry_date": self.expiry_date.strftime("%Y-%m-%d")
            if self.expiry_date
            else None,
            "inventory_status": self.inventory_status,
            "is_ordered": self.is_ordered,
            "statuses": self.statuses,
            "status": self.status,
        }

    def __str__(self):
        return f"{self.item_code} - {self.name} ({self.unit})"


class StockItemUnit(models.Model):
    item = models.ForeignKey(StockItem, on_delete=models.CASCADE, related_name="units")
    unit = models.CharField(max_length=10, choices=UnitChoice.choices)
    pcs_per_unit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=1.00,
        help_text="How many pieces (PCS) are in this unit (e.g. 12 for DZN, 24 for BOX of 24 pcs)",
    )
    is_base_unit = models.BooleanField(
        default=False, help_text="True if this is the base unit of the item"
    )

    class Meta:
        unique_together = ("item", "unit")
        verbose_name = "Stock Item Unit"
        verbose_name_plural = "Stock Item Units"
        ordering = ["pcs_per_unit"]

    def save(self, *args, **kwargs):
        # Auto-fill standard known conversions if not customized
        if self.unit == UnitChoice.PCS:
            self.pcs_per_unit = 1.00
            self.is_base_unit = True
        elif self.unit == UnitChoice.DZN and (
            not self.pcs_per_unit or self.pcs_per_unit == 1.00
        ):
            self.pcs_per_unit = 12.00
        elif self.unit == UnitChoice.GROSS and (
            not self.pcs_per_unit or self.pcs_per_unit == 1.00
        ):
            self.pcs_per_unit = 144.00
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.item.name} - 1 {self.unit} = {self.pcs_per_unit} PCS"


class PartyType(models.TextChoices):
    CLIENT = "CLIENT", "Client / Customer"
    VENDOR = "VENDOR", "Vendor / Supplier"
    BOTH = "BOTH", "Both (Client & Vendor)"


class ClientsAndVendors(models.Model):
    pk_cities = {
        "KH": "Karachi",
        "LH": "Lahore",
        "IS": "Islamabad",
        "RW": "Rawalpindi",
        "FS": "Faisalabad",
        "MT": "Multan",
        "PW": "Peshawar",
        "QT": "Quetta",
        "HY": "Hyderabad",
        "GW": "Gujranwala",
        "SL": "Sialkot",
        "SG": "Sargodha",
        "BW": "Bahawalpur",
        "SU": "Sukkur",
        "LK": "Larkana",
        "SK": "Sheikhupura",
        "GJ": "Gujrat",
        "MD": "Mardan",
        "AB": "Abbottabad",
        "MZ": "Muzaffarabad",
    }

    # Areas of Karachi (two-character key -> area name)
    karachi_areas = {
        "SD": "Saddar",
        "CL": "Clifton",
        "DH": "DHA (Defence Housing Authority)",
        "GI": "Gulshan-e-Iqbal",
        "GJ": "Gulistan-e-Johar",
        "GM": "Gulshan-e-Maymar",
        "NN": "North Nazimabad",
        "NZ": "Nazimabad",
        "NK": "New Karachi",
        "KR": "Korangi",
        "LD": "Landhi",
        "ML": "Malir",
        "LY": "Lyari",
        "OT": "Orangi Town",
        "BT": "Baldia Town",
        "ST": "SITE Area",
        "KM": "Keamari",
        "PE": "PECHS",
        "BD": "Bahadurabad",
        "BO": "Bohrapir",
        "FB": "Federal B Area",
        "LQ": "Liaquatabad",
        "GD": "Garden",
        "GZ": "Gizri",
        "TR": "Tariq Road",
        "SF": "Shah Faisal Colony",
        "S3": "Scheme 33",
        "SJ": "Surjani Town",
        "MP": "Mauripur",
        "MC": "Model Colony",
        "SH": "Sohrab Goth",
        "MG": "Manghopir",
        "IH": "Ibrahim Hyderi",
        "KD": "Kharadar",
        "MI": "Mithadar",
    }

    client_name = models.CharField(max_length=150, help_text="Party / Business or Individual Name")
    party_type = models.CharField(
        max_length=10,
        choices=PartyType.choices,
        default=PartyType.CLIENT,
        help_text="Designate if this entity is a Client, Vendor, or Both",
    )
    phone = models.CharField(max_length=50, blank=True, default="", help_text="Contact Phone", null = True,)
    email = models.EmailField(blank=True, default="", null = True)
    client_city = models.CharField(max_length=2, choices=pk_cities, default="KH")
    client_area = models.CharField(max_length=2, choices=karachi_areas, null=True, blank=True)
    address = models.TextField(blank=True, default="", help_text="Full address")
    ntn_number = models.CharField(max_length=50, blank=True, default="", help_text="National Tax Number / STRN", null = True)

    # Financial Balances
    client_balance = models.DecimalField(
        max_digits=20, decimal_places=3, default=0.000, help_text="Net ledger balance"
    )
    receivable_balance = models.DecimalField(
        max_digits=20, decimal_places=3, default=0.000, help_text="Amount client owes us (Credit)"
    )
    payable_balance = models.DecimalField(
        max_digits=20, decimal_places=3, default=0.000, help_text="Amount we owe vendor (Payable)"
    )
    credit_limit = models.DecimalField(
        max_digits=20, decimal_places=3, default=0.000, help_text="Max credit limit allowed"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Client / Vendor"
        verbose_name_plural = "Clients and Vendors"
        ordering = ["client_name"]

    @property
    def name(self):
        return self.client_name

    def is_vendor(self):
        return self.party_type in [PartyType.VENDOR, PartyType.BOTH]

    def is_client(self):
        return self.party_type in [PartyType.CLIENT, PartyType.BOTH]

    def __str__(self):
        return f"{self.client_name} ({self.get_party_type_display()}) - {self.pk_cities.get(self.client_city, self.client_city)}"


class ApprovedVendorItem(models.Model):
    """
    Catalog of approved (StockItem, Vendor) relationships.
    Only the Owner can introduce and approve new items or new vendors for existing items.
    """
    item = models.ForeignKey(StockItem, on_delete=models.CASCADE, related_name="approved_vendors")
    vendor = models.ForeignKey(
        ClientsAndVendors,
        on_delete=models.CASCADE,
        related_name="approved_items",
        limit_choices_to={"party_type__in": [PartyType.VENDOR, PartyType.BOTH]},
    )
    negotiated_price = models.DecimalField(
        max_digits=12, decimal_places=2, default=0.00, help_text="Agreed purchase price per base unit in PKR"
    )
    is_active = models.BooleanField(default=True, help_text="Is this vendor currently active for this item")
    approved_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="approved_vendor_items"
    )
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("item", "vendor")
        verbose_name = "Approved Vendor Item"
        verbose_name_plural = "Approved Vendor Items"

    def __str__(self):
        return f"{self.item.name} <-> {self.vendor.client_name} (PKR {self.negotiated_price})"


class ExpenseCategory(models.Model):
    name = models.CharField(max_length=100, unique=True, help_text="e.g. Rent, Electricity, Salaries, Freight, Taxes")
    description = models.TextField(blank=True, default="")

    class Meta:
        verbose_name_plural = "Expense Categories"

    def __str__(self):
        return self.name


class Expense(models.Model):
    PAYMENT_METHODS = [
        ("CASH", "Cash"),
        ("BANK", "Bank Transfer"),
        ("CHEQUE", "Cheque"),
        ("ONLINE", "Online / Digital"),
    ]

    category = models.ForeignKey(ExpenseCategory, on_delete=models.PROTECT, related_name="expenses")
    title = models.CharField(max_length=255, help_text="Description of expense")
    amount = models.DecimalField(max_digits=14, decimal_places=2, help_text="Amount in PKR")
    expense_date = models.DateField(default=timezone.now, help_text="Date of expense")
    paid_to = models.ForeignKey(
        ClientsAndVendors,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="expenses_received",
        help_text="Vendor or service provider paid (optional)",
    )
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default="CASH")
    receipt_doc = models.FileField(upload_to="expenses/", blank=True, null=True, help_text="Scanned receipt or bill")
    logged_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="logged_expenses"
    )
    approved_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="approved_expenses"
    )
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-expense_date", "-id"]

    def __str__(self):
        return f"{self.title} - PKR {self.amount} ({self.expense_date})"


class DailyFinancialSummary(models.Model):
    """
    Owner financial snapshot report model:
    Tracks Revenue, Cost of Goods Sold, Gross Profit, Expenses, and Net Profit.
    """
    report_date = models.DateField(unique=True, help_text="Summary Date")
    total_revenue = models.DecimalField(
        max_digits=16, decimal_places=2, default=0.00, help_text="Total sales revenue for the day"
    )
    cost_of_goods_sold = models.DecimalField(
        max_digits=16, decimal_places=2, default=0.00, help_text="Total cost of items sold (COGS)"
    )
    gross_profit = models.DecimalField(
        max_digits=16, decimal_places=2, default=0.00, help_text="Revenue - COGS"
    )
    total_expenses = models.DecimalField(
        max_digits=16, decimal_places=2, default=0.00, help_text="Total operating expenses"
    )
    net_profit = models.DecimalField(
        max_digits=16, decimal_places=2, default=0.00, help_text="Gross Profit - Expenses"
    )
    cash_in_hand = models.DecimalField(
        max_digits=16, decimal_places=2, default=0.00, help_text="Closing physical cash"
    )
    total_receivables = models.DecimalField(
        max_digits=16, decimal_places=2, default=0.00, help_text="Total pending customer debt"
    )
    total_payables = models.DecimalField(
        max_digits=16, decimal_places=2, default=0.00, help_text="Total pending supplier debt"
    )
    notes = models.TextField(blank=True, default="")
    generated_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="generated_reports"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-report_date"]
        verbose_name = "Daily Financial Summary"
        verbose_name_plural = "Daily Financial Summaries"

    def calculate_metrics(self):
        self.gross_profit = self.total_revenue - self.cost_of_goods_sold
        self.net_profit = self.gross_profit - self.total_expenses

    def save(self, *args, **kwargs):
        self.calculate_metrics()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Report {self.report_date} | Net Profit: PKR {self.net_profit}"


class Order(models.Model):
    item = models.ForeignKey(StockItem, on_delete=models.CASCADE, related_name="orders")
    quantity = models.PositiveIntegerField(help_text="Units to order")
    supplier = models.CharField(max_length=255)
    note = models.TextField(blank=True, default="", help_text="Optional order notes")
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="Ordered")

    class Meta:
        ordering = ["-created_at"]

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


class Owner(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="owner_profile"
    )

    def __str__(self):
        return f"Owner: {self.user.username}"


class CashierAccountant(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="cashier_profile"
    )

    def __str__(self):
        return f"Cashier/Accountant: {self.user.username}"


class WarehouseManager(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="warehouse_manager_profile"
    )

    def __str__(self):
        return f"Warehouse Manager: {self.user.username}"


class Worker(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="worker_profile"
    )

    def __str__(self):
        return f"Worker: {self.user.username}"
