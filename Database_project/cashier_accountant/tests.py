import json
from datetime import date
from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from wholesale_hardware.models import (
    StockItem,
    ClientsAndVendors,
    PartyType,
    ApprovedVendorItem,
    ExpenseCategory,
    Expense,
    DailyFinancialSummary,
    Owner,
    CashierAccountant,
)
from cashier_accountant.models import (
    PurchaseOrder,
    SaleInvoice,
    SaleItem,
    CustomerPayment,
)
from datetime import date


class CashierOrderingAndOwnerModelsTestCase(TestCase):
    def setUp(self):
        # Create Owner User & Profile
        self.owner_user = User.objects.create_user(username="owner_user", password="password123")
        self.owner_profile = Owner.objects.create(user=self.owner_user)

        # Create Cashier User & Profile
        self.cashier_user = User.objects.create_user(username="cashier_user", password="password123")
        self.cashier_profile = CashierAccountant.objects.create(user=self.cashier_user)

        # Create Vendors & Clients in unified ClientsAndVendors table
        self.vendor_a = ClientsAndVendors.objects.create(
            client_name="Apex Hardware Supplies",
            party_type=PartyType.VENDOR,
            client_city="KH",
            client_area="SD",
            phone="03001234567",
        )
        self.vendor_b = ClientsAndVendors.objects.create(
            client_name="Crown Industrial Tools",
            party_type=PartyType.VENDOR,
            client_city="LH",
            phone="03007654321",
        )
        self.client_customer = ClientsAndVendors.objects.create(
            client_name="Ali Construction Ltd",
            party_type=PartyType.CLIENT,
            client_city="KH",
            client_area="DH",
            phone="03219876543",
        )
        self.dual_partner = ClientsAndVendors.objects.create(
            client_name="Pak Builders & Suppliers",
            party_type=PartyType.BOTH,
            client_city="IS",
            phone="03335555555",
        )

        # Create Stock Items
        self.item_hammer = StockItem.objects.create(
            name="Steel Claw Hammer 16oz",
            item_code="HAM-001",
            category="Hand Tools",
            current_quantity=20,
            purchase_price=450.00,
            selling_price=650.00,
        )
        self.item_drill = StockItem.objects.create(
            name="Impact Drill 13mm",
            item_code="DRL-001",
            category="Power Tools",
            current_quantity=5,
            purchase_price=5500.00,
            selling_price=7200.00,
        )

    def test_clients_and_vendors_unified_model(self):
        """Verify client, vendor, and dual entities coexist in ClientsAndVendors table."""
        self.assertTrue(self.vendor_a.is_vendor())
        self.assertFalse(self.vendor_a.is_client())

        self.assertTrue(self.client_customer.is_client())
        self.assertFalse(self.client_customer.is_vendor())

        self.assertTrue(self.dual_partner.is_client())
        self.assertTrue(self.dual_partner.is_vendor())

    def test_owner_can_order_new_item_from_any_vendor(self):
        """Owner can order any item from any vendor, automatically approving the pair."""
        po = PurchaseOrder.objects.create(
            item=self.item_hammer,
            vendor=self.vendor_a,
            quantity=50,
            unit_cost_price=450.00,
            placed_by=self.owner_user,
        )
        self.assertIsNotNone(po.id)
        # Verify it auto-registered in ApprovedVendorItem
        self.assertTrue(
            ApprovedVendorItem.objects.filter(item=self.item_hammer, vendor=self.vendor_a).exists()
        )

    def test_cashier_cannot_order_brand_new_item(self):
        """Cashier CANNOT order an item that has never been ordered or approved before."""
        with self.assertRaises(ValidationError) as context:
            PurchaseOrder.objects.create(
                item=self.item_drill,
                vendor=self.vendor_a,
                quantity=10,
                unit_cost_price=5500.00,
                placed_by=self.cashier_user,
            )
        self.assertIn("item", context.exception.message_dict)
        self.assertIn("never been ordered before", str(context.exception))

    def test_cashier_cannot_order_existing_item_from_different_vendor_first_time(self):
        """
        If Hammer was approved/ordered with Vendor A, cashier CANNOT order Hammer
        from Vendor B for the first time without Owner approval.
        """
        # Approved with Vendor A
        ApprovedVendorItem.objects.create(
            item=self.item_hammer,
            vendor=self.vendor_a,
            negotiated_price=450.00,
            approved_by=self.owner_user,
        )

        # Cashier tries to order Hammer from Vendor B (first time)
        with self.assertRaises(ValidationError) as context:
            PurchaseOrder.objects.create(
                item=self.item_hammer,
                vendor=self.vendor_b,
                quantity=20,
                unit_cost_price=440.00,
                placed_by=self.cashier_user,
            )
        self.assertIn("vendor", context.exception.message_dict)
        self.assertIn("never been ordered from vendor 'Crown Industrial Tools' before", str(context.exception))

    def test_cashier_can_reorder_item_from_approved_vendor(self):
        """Cashier CAN re-order an existing item from an already approved/historical vendor."""
        # Establish prior approval with Vendor A
        ApprovedVendorItem.objects.create(
            item=self.item_hammer,
            vendor=self.vendor_a,
            negotiated_price=450.00,
            approved_by=self.owner_user,
        )

        po = PurchaseOrder.objects.create(
            item=self.item_hammer,
            vendor=self.vendor_a,
            quantity=30,
            unit_cost_price=450.00,
            placed_by=self.cashier_user,
        )
        self.assertIsNotNone(po.id)
        self.assertEqual(po.status, "ORDERED")

    def test_owner_expenses_revenue_profit_report(self):
        """Verify Owner financial models track expenses and calculate gross & net profit."""
        cat_utilities = ExpenseCategory.objects.create(name="Utilities")
        expense = Expense.objects.create(
            category=cat_utilities,
            title="K-Electric Factory Bill",
            amount=25000.00,
            expense_date=date.today(),
            logged_by=self.owner_user,
            approved_by=self.owner_user,
        )
        self.assertEqual(expense.amount, 25000.00)

        # Create Financial Summary: Revenue 100,000 | COGS 60,000 | Expense 25,000 -> Gross 40,000, Net 15,000
        summary = DailyFinancialSummary.objects.create(
            report_date=date.today(),
            total_revenue=100000.00,
            cost_of_goods_sold=60000.00,
            total_expenses=25000.00,
            generated_by=self.owner_user,
        )
        self.assertEqual(summary.gross_profit, 40000.00)
        self.assertEqual(summary.net_profit, 15000.00)


class LoginPortalAndCashierPortalViewsTestCase(TestCase):
    def setUp(self):
        # Create Owner User & Profile
        self.owner_user = User.objects.create_user(username="owner_test", password="password123")
        self.owner_profile = Owner.objects.create(user=self.owner_user)

        # Create Cashier User & Profile
        self.cashier_user = User.objects.create_user(username="cashier_test", password="password123")
        self.cashier_profile = CashierAccountant.objects.create(user=self.cashier_user)

        # Create Vendor & Client
        self.vendor = ClientsAndVendors.objects.create(
            client_name="Crown Supplies",
            party_type=PartyType.VENDOR,
            client_city="KH",
        )
        self.client_party = ClientsAndVendors.objects.create(
            client_name="Karachi Builders",
            party_type=PartyType.CLIENT,
            client_city="KH",
        )

        # Create Stock Item
        self.item = StockItem.objects.create(
            name="Cordless Drill 18V",
            item_code="CD-18V",
            category="Power Tools",
            current_quantity=20,
            purchase_price=8000.00,
            selling_price=10500.00,
        )

        # Pre-approve item with vendor
        ApprovedVendorItem.objects.create(
            item=self.item,
            vendor=self.vendor,
            negotiated_price=8000.00,
            approved_by=self.owner_user,
        )

    def test_anonymous_redirected_from_dashboard(self):
        """Anonymous user trying to access /dashboard/ is redirected to /login/."""
        response = self.client.get("/dashboard/")
        self.assertEqual(response.status_code, 302)
        self.assertIn("/login/", response.url)

    def test_cashier_redirected_from_owner_dashboard(self):
        """Cashier logged in trying to access /dashboard/ is blocked and redirected to /cashier/portal/."""
        self.client.login(username="cashier_test", password="password123")
        response = self.client.get("/dashboard/")
        self.assertEqual(response.status_code, 302)
        self.assertIn("/cashier/portal/", response.url)

    def test_owner_can_access_full_dashboard(self):
        """Owner logged in can access full /dashboard/."""
        self.client.login(username="owner_test", password="password123")
        response = self.client.get("/dashboard/")
        self.assertEqual(response.status_code, 200)

    def test_cashier_can_access_cashier_portal(self):
        """Cashier logged in can access /cashier/portal/."""
        self.client.login(username="cashier_test", password="password123")
        response = self.client.get("/cashier/portal/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Cashier Portal")

    def test_api_cashier_order_success(self):
        """Cashier can order approved item from approved vendor via API."""
        self.client.login(username="cashier_test", password="password123")
        response = self.client.post(
            "/cashier/api/order/",
            data=json.dumps({
                "item_id": self.item.id,
                "vendor_id": self.vendor.id,
                "quantity": 10,
                "unit_cost_price": 8000.00,
                "note": "Routine restock",
            }),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(PurchaseOrder.objects.count(), 1)

    def test_api_cashier_sale_reduces_stock(self):
        """Cashier recording sale reduces inventory and creates invoice."""
        self.client.login(username="cashier_test", password="password123")
        response = self.client.post(
            "/cashier/api/sale/",
            data=json.dumps({
                "client_id": self.client_party.id,
                "item_id": self.item.id,
                "quantity": 3,
                "unit_price": 10500.00,
                "payment_method": "CASH",
                "payment_status": "PAID",
            }),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.item.refresh_from_db()
        self.assertEqual(self.item.current_quantity, 17)  # 20 - 3 = 17

    def test_api_cashier_history_filter(self):
        """API history filters across time slots: today, weekly, monthly, yearly, inception."""
        self.client.login(username="cashier_test", password="password123")
        response = self.client.get("/cashier/api/history/?slot=today")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertIn("sales", data)
        self.assertIn("purchases", data)
