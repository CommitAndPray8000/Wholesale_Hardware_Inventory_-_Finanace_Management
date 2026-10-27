/**
 * Wholesale Hardware Management Platform
 * Interactive Frontend Engine
 */

// Initial Hardware Dataset
let inventoryData = [
  {
    id: 1,
    sku: "HW-DRL-201",
    name: "DeWalt 20V MAX XR Hammer Drill",
    category: "Power Tools",
    location: "Bay A-04",
    stock: 4,
    minThreshold: 20,
    cost: 119.50,
    contractorPrice: 159.00,
    bulkPrice: 145.00,
    msrp: 199.00,
    supplier: "DeWalt Industrial Tool Co."
  },
  {
    id: 2,
    sku: "HW-SCR-884",
    name: "3-Inch Zinc Galvanized Wood Screws (500-pk)",
    category: "Fasteners",
    location: "Bay B-12",
    stock: 6,
    minThreshold: 45,
    cost: 14.20,
    contractorPrice: 21.50,
    bulkPrice: 18.00,
    msrp: 29.99,
    supplier: "Fastener Express Ltd"
  },
  {
    id: 3,
    sku: "HW-VLV-102",
    name: "Brass Ball Valve 3/4\" Full Port Lead-Free",
    category: "Plumbing",
    location: "Bay C-02",
    stock: 3,
    minThreshold: 30,
    cost: 8.75,
    contractorPrice: 13.90,
    bulkPrice: 11.20,
    msrp: 18.50,
    supplier: "Midwest Valve & Fitting"
  },
  {
    id: 4,
    sku: "HW-CBL-441",
    name: "12/2 NM-B Romex Copper Electrical Wire (250ft)",
    category: "Electrical",
    location: "Bay D-01",
    stock: 58,
    minThreshold: 25,
    cost: 88.00,
    contractorPrice: 118.00,
    bulkPrice: 104.00,
    msrp: 142.00,
    supplier: "Southwire Electrical Supply"
  },
  {
    id: 5,
    sku: "HW-SAW-309",
    name: "Milwaukee M18 FUEL Reciprocating Sawzall",
    category: "Power Tools",
    location: "Bay A-09",
    stock: 22,
    minThreshold: 15,
    cost: 145.00,
    contractorPrice: 189.00,
    bulkPrice: 172.00,
    msrp: 239.00,
    supplier: "Milwaukee Electric Tool"
  },
  {
    id: 6,
    sku: "HW-ANC-512",
    name: "Heavy-Duty Wedge Anchor Bolts 1/2\" x 4-1/4\" (50pk)",
    category: "Fasteners",
    location: "Bay B-06",
    stock: 74,
    minThreshold: 40,
    cost: 32.50,
    contractorPrice: 48.00,
    bulkPrice: 42.00,
    msrp: 64.00,
    supplier: "Hilti Anchor Systems"
  },
  {
    id: 7,
    sku: "HW-PIP-220",
    name: "Type L Copper Pipe 1/2\" x 10ft Rigid Hard Temper",
    category: "Plumbing",
    location: "Bay C-11",
    stock: 110,
    minThreshold: 50,
    cost: 16.40,
    contractorPrice: 24.50,
    bulkPrice: 21.00,
    msrp: 33.00,
    supplier: "Mueller Industries"
  },
  {
    id: 8,
    sku: "HW-BRK-901",
    name: "Square D 20-Amp Single-Pole Circuit Breaker",
    category: "Electrical",
    location: "Bay D-08",
    stock: 0,
    minThreshold: 35,
    cost: 6.20,
    contractorPrice: 9.80,
    bulkPrice: 8.50,
    msrp: 14.50,
    supplier: "Schneider Electric"
  },
  {
    id: 9,
    sku: "HW-GLV-045",
    name: "Level 4 Cut-Resistant Work Gloves (12-Pair Pack)",
    category: "Safety & PPE",
    location: "Bay E-03",
    stock: 85,
    minThreshold: 30,
    cost: 26.00,
    contractorPrice: 39.00,
    bulkPrice: 34.00,
    msrp: 52.00,
    supplier: "Ansell Protective Solutions"
  },
  {
    id: 10,
    sku: "HW-GRN-112",
    name: "Makita 4-1/2\" Paddle Switch Angle Grinder",
    category: "Power Tools",
    location: "Bay A-02",
    stock: 31,
    minThreshold: 15,
    cost: 72.00,
    contractorPrice: 98.00,
    bulkPrice: 89.00,
    msrp: 124.00,
    supplier: "Makita USA"
  }
];

// Initial Ledger Dataset (Credit & Debt)
let ledgerData = [
  {
    id: 1,
    type: "Credit", // Contractor Receivable
    party: "Apex Construction Corp",
    ref: "INV-CR-409",
    amount: 18450.00,
    paid: 12000.00,
    dueDate: "2026-11-15",
    terms: "Net 30",
    notes: "Commercial fasteners, hammer drills & bulk framing anchors",
    status: "Partial"
  },
  {
    id: 2,
    type: "Debt", // Supplier Payable
    party: "DeWalt Industrial Tool Co.",
    ref: "PO-DB-881",
    amount: 24500.00,
    paid: 15000.00,
    dueDate: "2026-11-20",
    terms: "Net 60",
    notes: "Q4 20V Max cordless tools restock shipment",
    status: "Partial"
  },
  {
    id: 3,
    type: "Credit",
    party: "Miller Electrical Contractors",
    ref: "INV-CR-398",
    amount: 9200.00,
    paid: 0.00,
    dueDate: "2026-11-05",
    terms: "Net 30",
    notes: "12/2 Romex copper spools and breaker panels",
    status: "Outstanding"
  },
  {
    id: 4,
    type: "Debt",
    party: "Southwire Electrical Supply",
    ref: "PO-DB-872",
    amount: 14800.00,
    paid: 14800.00,
    dueDate: "2026-10-25",
    terms: "Net 30",
    notes: "High voltage electrical conduits & wiring pallets",
    status: "Settled"
  },
  {
    id: 5,
    type: "Credit",
    party: "Summit Plumbing & Heating LLC",
    ref: "INV-CR-384",
    amount: 7350.00,
    paid: 3000.00,
    dueDate: "2026-10-20",
    terms: "Net 15",
    notes: "Type L rigid copper pipes and full port brass ball valves",
    status: "Overdue"
  },
  {
    id: 6,
    type: "Debt",
    party: "Makita USA Corporate",
    ref: "PO-DB-866",
    amount: 12600.00,
    paid: 6000.00,
    dueDate: "2026-11-30",
    terms: "Net 45",
    notes: "Paddle switch angle grinders & diamond blades batch",
    status: "Partial"
  },
  {
    id: 7,
    type: "Credit",
    party: "Horizon Builders Guild",
    ref: "INV-CR-415",
    amount: 16800.00,
    paid: 16800.00,
    dueDate: "2026-11-10",
    terms: "Net 30",
    notes: "Heavy duty steel wedge anchors and galvanized wood screws",
    status: "Settled"
  },
  {
    id: 8,
    type: "Debt",
    party: "Mueller Industries Valves",
    ref: "PO-DB-859",
    amount: 8900.00,
    paid: 0.00,
    dueDate: "2026-11-18",
    terms: "Net 30",
    notes: "Commercial grade brass shutoff valves and fitting couplers",
    status: "Outstanding"
  }
];

// State variables
let currentTab = "dashboard";
let selectedCategory = "All";
let selectedStockStatus = "All";
let currentLedgerFilter = "all"; // 'all', 'credit', 'debt'
let selectedLedgerStatus = "All";
let searchTerm = "";
let editingItemId = null;
let settlingLedgerId = null;

// Application Bootstrap
function initApp() {
  if (window.__APP_INITIALIZED__) return;
  window.__APP_INITIALIZED__ = true;

  initNavigation();
  initSearch();
  initDropdowns();
  initModals();
  renderAllViews();

  // Set default view to dashboard
  switchView("dashboard");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

/* ==========================================================================
   NAVIGATION & PAGE SWITCHING ENGINE
   ========================================================================== */
function switchView(targetView) {
  if (!targetView) return;

  // 1. Hide all view sections and activate the target view
  const viewSections = document.querySelectorAll(".view-section");
  let foundTarget = false;

  viewSections.forEach(section => {
    if (section.id === `view-${targetView}`) {
      section.classList.add("active");
      foundTarget = true;
    } else {
      section.classList.remove("active");
    }
  });

  if (!foundTarget) {
    console.warn(`Target view "view-${targetView}" not found in page DOM.`);
  }

  currentTab = targetView;

  // 2. Clear all previous active states on navigation items
  document.querySelectorAll(".nav-item, .logout-btn, .user-profile-badge, .mini-option-btn").forEach(el => {
    el.classList.remove("active");
  });

  // 3. Highlight the matching option(s) in sidebar
  const activeTriggers = document.querySelectorAll(`[data-view="${targetView}"]`);
  activeTriggers.forEach(el => el.classList.add("active"));

  // If sub-view of Ledger (Credit / Debt), keep Ledger parent item active too
  if (targetView === "credit" || targetView === "debt") {
    const parentLedger = document.getElementById("nav-ledger");
    if (parentLedger) parentLedger.classList.add("active");
  }

  // 4. Update topbar search placeholder to reflect active page
  const searchInput = document.getElementById("global-search");
  if (searchInput) {
    const capitalized = targetView.charAt(0).toUpperCase() + targetView.slice(1);
    searchInput.placeholder = `Search in ${capitalized}...`;
  }

  // 5. Safely invoke view renderers if elements exist
  try {
    if (targetView === "dashboard") renderDashboard();
    if (targetView === "stock") renderStockTable();
    if (targetView === "prices") renderPricesTable();
    if (targetView === "ledger") renderLedger();
    if (targetView === "reports") renderReports();
  } catch (err) {
    // Graceful fallback for blank page views
  }
}

function initNavigation() {
  // Listen for clicks on any element with data-view
  // Includes: Dashboard, Stock, Prices, Ledger, Credit, Debt, Reports, Settings, Logout, Profile
  const navTriggers = document.querySelectorAll("[data-view]");

  navTriggers.forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = trigger.getAttribute("data-view");
      if (targetView) {
        switchView(targetView);
      }
    });
  });

  // Global helper for opening ledger modes directly
  window.openLedgerWithMode = function(mode) {
    switchView(mode);
  };
}

/* ==========================================================================
   SEARCH BAR
   ========================================================================== */
function initSearch() {
  const globalSearch = document.getElementById("global-search");
  if (globalSearch) {
    globalSearch.addEventListener("input", (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      
      // If user starts searching while not on stock, prices, or ledger, switch to stock
      if (searchTerm.length > 0 && currentTab === "dashboard") {
        document.querySelector('[data-view="stock"]').click();
      }
      
      renderStockTable();
      renderPricesTable();
      renderLedger();
    });
  }

  // Keyboard shortcut Ctrl+K or / to focus search
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey && e.key.toLowerCase() === "k") || (e.key === "/" && document.activeElement.tagName !== "INPUT")) {
      e.preventDefault();
      if (globalSearch) {
        globalSearch.focus();
        globalSearch.select();
      }
    }
  });
}

/* ==========================================================================
   DROPDOWNS (Notifications, User Profile, Help)
   ========================================================================== */
function initDropdowns() {
  const notifBtn = document.getElementById("notif-btn");
  const notifMenu = document.getElementById("notif-menu");
  const avatarBtn = document.getElementById("avatar-btn");
  const avatarMenu = document.getElementById("avatar-menu");
  const helpBtn = document.getElementById("help-btn");

  if (notifBtn && notifMenu) {
    notifBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllDropdowns();
      notifMenu.classList.toggle("active");
    });
  }

  if (avatarBtn && avatarMenu) {
    avatarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllDropdowns();
      avatarMenu.classList.toggle("active");
    });
  }

  if (helpBtn) {
    helpBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllDropdowns();
      openModal("modal-help");
    });
  }

  // Close when clicking outside
  document.addEventListener("click", () => {
    closeAllDropdowns();
  });

  document.querySelectorAll(".dropdown-menu").forEach(menu => {
    menu.addEventListener("click", (e) => e.stopPropagation());
  });
}

function closeAllDropdowns() {
  document.querySelectorAll(".dropdown-menu").forEach(menu => {
    menu.classList.remove("active");
  });
}

/* ==========================================================================
   MODALS
   ========================================================================== */
function initModals() {
  // Modal close buttons
  document.querySelectorAll(".modal-close-trigger").forEach(btn => {
    btn.addEventListener("click", () => {
      closeAllModals();
    });
  });

  // Modal backdrop click
  document.querySelectorAll(".modal-backdrop").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  // Add Item Form Submit
  const addItemForm = document.getElementById("form-add-item");
  if (addItemForm) {
    addItemForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveItem();
    });
  }

  // Adjust Stock Form Submit
  const adjustStockForm = document.getElementById("form-adjust-stock");
  if (adjustStockForm) {
    adjustStockForm.addEventListener("submit", (e) => {
      e.preventDefault();
      applyStockAdjustment();
    });
  }

  // Bulk Price Form Submit
  const bulkPriceForm = document.getElementById("form-bulk-price");
  if (bulkPriceForm) {
    bulkPriceForm.addEventListener("submit", (e) => {
      e.preventDefault();
      applyBulkPriceChange();
    });
  }

  // Add Ledger Transaction Form Submit
  const addLedgerForm = document.getElementById("form-add-ledger");
  if (addLedgerForm) {
    addLedgerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveLedgerEntry();
    });
  }

  // Settle Ledger Payment Form Submit
  const settleLedgerForm = document.getElementById("form-settle-ledger");
  if (settleLedgerForm) {
    settleLedgerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      applySettlement();
    });
  }
}

function openModal(modalId) {
  closeAllDropdowns();
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
  }
}

function closeAllModals() {
  document.querySelectorAll(".modal-backdrop").forEach(modal => {
    modal.classList.remove("active");
  });
  editingItemId = null;
}

/* ==========================================================================
   VIEW RENDERING
   ========================================================================== */
function renderAllViews() {
  renderDashboard();
  renderStockTable();
  renderPricesTable();
  renderLedger();
  renderReports();
}

/* DASHBOARD VIEW */
function renderDashboard() {
  // Calculate stats
  let totalValuation = 0;
  let totalItemsCount = inventoryData.length;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  inventoryData.forEach(item => {
    totalValuation += item.cost * item.stock;
    if (item.stock === 0) {
      outOfStockCount++;
      lowStockCount++;
    } else if (item.stock <= item.minThreshold) {
      lowStockCount++;
    }
  });

  // Update KPI counters
  const elValuation = document.getElementById("stat-total-valuation");
  const elSKUs = document.getElementById("stat-total-skus");
  const elLowStock = document.getElementById("stat-low-stock");
  const badgeLowStockNav = document.getElementById("nav-badge-stock");

  if (elValuation) elValuation.textContent = `$${totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (elSKUs) elSKUs.textContent = `${totalItemsCount} Products`;
  if (elLowStock) elLowStock.textContent = `${lowStockCount} Items`;
  if (badgeLowStockNav) badgeLowStockNav.textContent = lowStockCount;

  // Render Low Stock Radar List
  const alertListContainer = document.getElementById("dashboard-alert-list");
  if (alertListContainer) {
    const lowStockItems = inventoryData.filter(i => i.stock <= i.minThreshold);
    if (lowStockItems.length === 0) {
      alertListContainer.innerHTML = `<div style="text-align:center; padding: 20px; color: #10b981; font-weight: 500;">✓ All stock levels are within optimal thresholds.</div>`;
    } else {
      alertListContainer.innerHTML = lowStockItems.map(item => `
        <div class="alert-row">
          <div class="alert-info">
            <span class="alert-sku">${item.sku} • ${item.category}</span>
            <span class="alert-name">${item.name}</span>
          </div>
          <div style="display:flex; align-items:center; gap: 8px;">
            <span class="alert-stock-pill">${item.stock} left (Min: ${item.minThreshold})</span>
            <button class="btn btn-secondary btn-sm" onclick="quickReorder(${item.id})">Restock</button>
          </div>
        </div>
      `).join("");
    }
  }

  // Render Fast-Moving Stock Table on Dashboard
  const fastStockBody = document.getElementById("dashboard-stock-tbody");
  if (fastStockBody) {
    const topItems = inventoryData.slice(0, 5);
    fastStockBody.innerHTML = topItems.map(item => {
      const status = getStockStatus(item.stock, item.minThreshold);
      const percent = Math.min(100, Math.round((item.stock / (item.minThreshold * 2)) * 100));
      return `
        <tr>
          <td>
            <div style="font-weight: 600; color: #0f172a;">${item.name}</div>
            <span class="sku-badge">${item.sku}</span>
          </td>
          <td>${item.location}</td>
          <td>
            <div class="stock-bar-wrapper">
              <span class="stock-count">${item.stock}</span>
              <div class="stock-bar">
                <div class="stock-bar-fill" style="width: ${percent}%; background-color: ${status.barColor};"></div>
              </div>
            </div>
          </td>
          <td><span class="badge ${status.badgeClass}">${status.label}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="openAdjustModal(${item.id})">Adjust</button>
          </td>
        </tr>
      `;
    }).join("");
  }
}

/* STOCK MANAGEMENT VIEW */
function renderStockTable() {
  const tbody = document.getElementById("stock-table-body");
  if (!tbody) return;

  // Filter items
  const filtered = inventoryData.filter(item => {
    // Category filter
    if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
    
    // Status filter
    if (selectedStockStatus === "In Stock" && item.stock <= item.minThreshold) return false;
    if (selectedStockStatus === "Low Stock" && (item.stock > item.minThreshold || item.stock === 0)) return false;
    if (selectedStockStatus === "Out of Stock" && item.stock > 0) return false;

    // Search query
    if (searchTerm) {
      const matchName = item.name.toLowerCase().includes(searchTerm);
      const matchSku = item.sku.toLowerCase().includes(searchTerm);
      const matchCat = item.category.toLowerCase().includes(searchTerm);
      const matchLoc = item.location.toLowerCase().includes(searchTerm);
      if (!matchName && !matchSku && !matchCat && !matchLoc) return false;
    }
    return true;
  });

  const totalCountEl = document.getElementById("stock-total-counter");
  if (totalCountEl) totalCountEl.textContent = `Showing ${filtered.length} of ${inventoryData.length} items`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 48px; color: #64748b;">
          <div style="font-size: 16px; font-weight: 600; margin-bottom: 6px;">No hardware items found</div>
          <div style="font-size: 13px;">Try adjusting your search query or active category filters.</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const status = getStockStatus(item.stock, item.minThreshold);
    const percent = Math.min(100, Math.round((item.stock / (item.minThreshold * 2)) * 100));
    return `
      <tr>
        <td>
          <input type="checkbox" style="cursor: pointer;">
        </td>
        <td>
          <span class="sku-badge">${item.sku}</span>
        </td>
        <td>
          <div style="font-weight: 600; color: #0f172a;">${item.name}</div>
          <div style="font-size: 11.5px; color: #64748b;">${item.supplier}</div>
        </td>
        <td>
          <span style="font-size: 12.5px; background: #f1f5f9; padding: 3px 8px; border-radius: 4px; color: #334155;">${item.category}</span>
        </td>
        <td>
          <span style="font-weight: 500; font-size: 12.5px;">${item.location}</span>
        </td>
        <td>
          <div class="stock-bar-wrapper">
            <span class="stock-count">${item.stock}</span>
            <div class="stock-bar">
              <div class="stock-bar-fill" style="width: ${percent}%; background-color: ${status.barColor};"></div>
            </div>
            <span style="font-size: 11px; color: #94a3b8;">/ ${item.minThreshold}</span>
          </div>
        </td>
        <td>
          <span class="badge ${status.badgeClass}">${status.label}</span>
        </td>
        <td>
          <strong>$${item.cost.toFixed(2)}</strong>
        </td>
        <td>
          <div class="table-actions">
            <button class="icon-action-btn" title="Adjust Stock" onclick="openAdjustModal(${item.id})">
              <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </button>
            <button class="icon-action-btn" title="Edit Item" onclick="openEditModal(${item.id})">
              <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="icon-action-btn delete-btn" title="Delete" onclick="deleteItem(${item.id})">
              <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

/* Helper for Stock Status */
function getStockStatus(stock, minThreshold) {
  if (stock === 0) {
    return { label: "Out of Stock", badgeClass: "badge-danger", barColor: "#ef4444" };
  } else if (stock <= minThreshold) {
    return { label: "Low Stock", badgeClass: "badge-warning", barColor: "#f59e0b" };
  } else {
    return { label: "In Stock", badgeClass: "badge-success", barColor: "#10b981" };
  }
}

/* PRICES TAB VIEW */
function renderPricesTable() {
  const tbody = document.getElementById("prices-table-body");
  if (!tbody) return;

  const filtered = inventoryData.filter(item => {
    if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
    if (searchTerm) {
      return item.name.toLowerCase().includes(searchTerm) || item.sku.toLowerCase().includes(searchTerm);
    }
    return true;
  });

  tbody.innerHTML = filtered.map(item => {
    const margin = (((item.contractorPrice - item.cost) / item.contractorPrice) * 100).toFixed(1);
    return `
      <tr>
        <td><span class="sku-badge">${item.sku}</span></td>
        <td>
          <div style="font-weight: 600; color: #0f172a;">${item.name}</div>
          <span style="font-size: 11px; color: #64748b;">${item.category}</span>
        </td>
        <td><strong>$${item.cost.toFixed(2)}</strong></td>
        <td>
          <span style="font-weight: 600; color: #4f46e5;">$${item.contractorPrice.toFixed(2)}</span>
        </td>
        <td>$${item.bulkPrice.toFixed(2)}</td>
        <td>$${item.msrp.toFixed(2)}</td>
        <td>
          <span class="badge ${margin > 30 ? 'badge-success' : 'badge-info'}">${margin}%</span>
        </td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="openEditModal(${item.id})">Update Price</button>
        </td>
      </tr>
    `;
  }).join("");
}

/* REPORTS VIEW */
function renderReports() {
  let totalCost = 0;
  let totalContractorVal = 0;
  
  inventoryData.forEach(item => {
    totalCost += item.cost * item.stock;
    totalContractorVal += item.contractorPrice * item.stock;
  });

  const potentialProfit = totalContractorVal - totalCost;
  
  const elHoldingCost = document.getElementById("report-total-holding");
  const elPotentialProfit = document.getElementById("report-potential-profit");

  if (elHoldingCost) elHoldingCost.textContent = `$${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (elPotentialProfit) elPotentialProfit.textContent = `$${potentialProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ==========================================================================
   LEDGER VIEW (CREDIT & DEBT)
   ========================================================================== */

function renderLedger() {
  const tbody = document.getElementById("ledger-table-body");
  if (!tbody) return;

  // 1. Calculate KPI Metrics across ledger
  let totalCreditOutstanding = 0;
  let totalDebtOutstanding = 0;
  let creditCount = 0;
  let debtCount = 0;
  let overdueCount = 0;

  const today = new Date().toISOString().slice(0, 10);

  ledgerData.forEach(entry => {
    const balance = Math.max(0, entry.amount - entry.paid);
    
    // Check if overdue
    if (balance > 0 && entry.dueDate < today) {
      entry.status = "Overdue";
      overdueCount++;
    } else if (balance === 0) {
      entry.status = "Settled";
    } else if (entry.paid > 0) {
      entry.status = "Partial";
    } else {
      entry.status = "Outstanding";
    }

    if (entry.type === "Credit") {
      totalCreditOutstanding += balance;
      creditCount++;
    } else {
      totalDebtOutstanding += balance;
      debtCount++;
    }
  });

  const netBalance = totalCreditOutstanding - totalDebtOutstanding;

  // Update KPI Elements
  const elCredit = document.getElementById("stat-total-credit");
  const elDebt = document.getElementById("stat-total-debt");
  const elNet = document.getElementById("stat-net-balance");
  const elOverdue = document.getElementById("stat-overdue-count");
  const elCreditCount = document.getElementById("stat-credit-count");
  const elDebtCount = document.getElementById("stat-debt-count");
  const elNetStatus = document.getElementById("stat-net-status");

  if (elCredit) elCredit.textContent = `$${totalCreditOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (elDebt) elDebt.textContent = `$${totalDebtOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (elNet) {
    elNet.textContent = `${netBalance >= 0 ? '+' : '-'}$${Math.abs(netBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    elNet.style.color = netBalance >= 0 ? '#4f46e5' : '#dc2626';
  }
  if (elNetStatus) {
    elNetStatus.textContent = netBalance >= 0 ? 'Surplus Liquidity' : 'Net Liability Exposure';
  }
  if (elOverdue) elOverdue.textContent = `${overdueCount} Accounts`;
  if (elCreditCount) elCreditCount.textContent = `${creditCount} contractor accounts`;
  if (elDebtCount) elDebtCount.textContent = `${debtCount} supplier accounts`;

  // Update Tab Badges
  const countAll = document.getElementById("ledger-count-all");
  const countCredit = document.getElementById("ledger-count-credit");
  const countDebt = document.getElementById("ledger-count-debt");
  if (countAll) countAll.textContent = ledgerData.length;
  if (countCredit) countCredit.textContent = creditCount;
  if (countDebt) countDebt.textContent = debtCount;

  // 2. Filter Table
  const filtered = ledgerData.filter(entry => {
    // Tab filter (all, credit, debt)
    if (currentLedgerFilter === "credit" && entry.type !== "Credit") return false;
    if (currentLedgerFilter === "debt" && entry.type !== "Debt") return false;

    // Status filter
    if (selectedLedgerStatus !== "All" && entry.status !== selectedLedgerStatus) return false;

    // Global Search
    if (searchTerm) {
      const matchParty = entry.party.toLowerCase().includes(searchTerm);
      const matchRef = entry.ref.toLowerCase().includes(searchTerm);
      const matchNotes = (entry.notes || '').toLowerCase().includes(searchTerm);
      const matchType = entry.type.toLowerCase().includes(searchTerm);
      if (!matchParty && !matchRef && !matchNotes && !matchType) return false;
    }
    return true;
  });

  const totalCounter = document.getElementById("ledger-total-counter");
  if (totalCounter) totalCounter.textContent = `Showing ${filtered.length} of ${ledgerData.length} ledger entries`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 48px; color: #64748b;">
          <div style="font-size: 16px; font-weight: 600; margin-bottom: 6px;">No ledger transactions found</div>
          <div style="font-size: 13px;">Try switching between Credit/Debt tabs or clearing search filters.</div>
        </td>
      </tr>
    `;
    return;
  }

  // 3. Render Rows
  tbody.innerHTML = filtered.map(entry => {
    const balance = Math.max(0, entry.amount - entry.paid);
    const isCredit = entry.type === "Credit";
    const typeBadge = isCredit 
      ? `<span class="badge badge-credit">Credit (Receivable)</span>` 
      : `<span class="badge badge-debt">Debt (Payable)</span>`;

    let statusBadge = "";
    if (entry.status === "Settled") statusBadge = `<span class="badge badge-success">✓ Settled</span>`;
    else if (entry.status === "Partial") statusBadge = `<span class="badge badge-info">Partial (${((entry.paid / entry.amount) * 100).toFixed(0)}%)</span>`;
    else if (entry.status === "Overdue") statusBadge = `<span class="badge badge-danger">! Overdue</span>`;
    else statusBadge = `<span class="badge badge-warning">Outstanding</span>`;

    const agingClass = entry.status === "Overdue" ? "due-overdue" : "due-ok";

    return `
      <tr>
        <td><span class="sku-badge">${entry.ref}</span></td>
        <td>${typeBadge}</td>
        <td>
          <div style="font-weight: 600; color: #0f172a;">${entry.party}</div>
          <div style="font-size: 11.5px; color: #64748b;">${entry.terms}</div>
        </td>
        <td style="max-width: 220px; font-size: 12.5px; color: #475569;">
          ${entry.notes || '—'}
        </td>
        <td><strong>$${entry.amount.toFixed(2)}</strong></td>
        <td>$${entry.paid.toFixed(2)}</td>
        <td>
          <span class="${isCredit ? 'credit-amount' : 'debt-amount'}">
            $${balance.toFixed(2)}
          </span>
        </td>
        <td>
          <div class="due-alert ${agingClass}">
            <span>${entry.dueDate}</span>
          </div>
        </td>
        <td>${statusBadge}</td>
        <td>
          <div class="table-actions">
            ${balance > 0 ? `
              <button class="btn btn-secondary btn-sm" style="padding: 4px 8px; font-size: 11.5px;" onclick="openSettleModal(${entry.id})">
                ${isCredit ? 'Receive' : 'Pay'}
              </button>
            ` : `
              <span style="font-size: 12px; color: #10b981; font-weight: 600;">Paid</span>
            `}
            <button class="icon-action-btn delete-btn" title="Delete Entry" onclick="deleteLedgerEntry(${entry.id})">
              <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function filterLedgerTab(tab) {
  currentLedgerFilter = tab;

  // Update tabs in main view
  document.querySelectorAll(".ledger-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tab);
  });

  // Update sidebar submenu active state
  document.querySelectorAll(".submenu-item").forEach(item => {
    item.classList.toggle("active", item.getAttribute("data-subtab") === tab);
  });

  renderLedger();
}

function filterLedgerStatus(status) {
  selectedLedgerStatus = status;
  renderLedger();
}

function openAddLedgerModal() {
  document.getElementById("form-add-ledger").reset();
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById("ledger-due-date").value = today;
  openModal("modal-add-ledger");
}

function saveLedgerEntry() {
  const type = document.getElementById("ledger-type").value;
  const party = document.getElementById("ledger-party").value.trim();
  const ref = document.getElementById("ledger-ref").value.trim();
  const amount = parseFloat(document.getElementById("ledger-amount").value) || 0;
  const paid = parseFloat(document.getElementById("ledger-paid").value) || 0;
  const dueDate = document.getElementById("ledger-due-date").value;
  const terms = document.getElementById("ledger-terms").value;
  const notes = document.getElementById("ledger-notes").value.trim();

  if (!party || !ref || amount <= 0) {
    showToast("Please provide Party Name, Reference #, and a positive amount", "warning");
    return;
  }

  const newId = ledgerData.length > 0 ? Math.max(...ledgerData.map(l => l.id)) + 1 : 1;
  const status = paid >= amount ? "Settled" : paid > 0 ? "Partial" : "Outstanding";

  ledgerData.unshift({
    id: newId,
    type,
    party,
    ref,
    amount,
    paid,
    dueDate,
    terms,
    notes,
    status
  });

  closeAllModals();
  renderLedger();
  showToast(`Recorded ${type} entry for ${party} ($${amount.toFixed(2)})`, "success");
}

function openSettleModal(id) {
  const entry = ledgerData.find(l => l.id === id);
  if (!entry) return;

  settlingLedgerId = id;
  const balance = Math.max(0, entry.amount - entry.paid);

  document.getElementById("settle-entry-id").value = entry.id;
  document.getElementById("settle-modal-title").textContent = entry.type === "Credit" ? "Receive Customer Payment" : "Settle Supplier Invoice";
  document.getElementById("settle-party-name").textContent = `${entry.party} (${entry.ref})`;
  document.getElementById("settle-current-balance").textContent = `$${balance.toFixed(2)}`;
  document.getElementById("settle-amount").value = balance.toFixed(2);
  document.getElementById("settle-amount").max = balance;

  openModal("modal-settle-ledger");
}

function applySettlement() {
  const id = parseInt(document.getElementById("settle-entry-id").value, 10);
  const payAmount = parseFloat(document.getElementById("settle-amount").value) || 0;
  const method = document.getElementById("settle-method").value;

  if (payAmount <= 0) {
    showToast("Please enter a valid payment amount", "warning");
    return;
  }

  const entry = ledgerData.find(l => l.id === id);
  if (!entry) return;

  const remaining = Math.max(0, entry.amount - entry.paid);
  if (payAmount > remaining) {
    showToast(`Payment exceeds outstanding balance of $${remaining.toFixed(2)}`, "warning");
    return;
  }

  entry.paid += payAmount;
  if (entry.paid >= entry.amount) {
    entry.status = "Settled";
  } else {
    entry.status = "Partial";
  }

  closeAllModals();
  renderLedger();
  showToast(`Processed $${payAmount.toFixed(2)} payment via ${method} for ${entry.party}`, "success");
}

function deleteLedgerEntry(id) {
  const entry = ledgerData.find(l => l.id === id);
  if (!entry) return;

  if (confirm(`Are you sure you want to delete ledger record ${entry.ref} (${entry.party})?`)) {
    ledgerData = ledgerData.filter(l => l.id !== id);
    renderLedger();
    showToast(`Deleted ledger entry ${entry.ref}`, "info");
  }
}

function exportLedgerCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "ID,Type,Reference,Account / Party,Amount,Paid,Remaining Balance,Due Date,Terms,Status,Notes\n";

  ledgerData.forEach(entry => {
    const balance = Math.max(0, entry.amount - entry.paid);
    const row = [
      entry.id,
      `"${entry.type}"`,
      `"${entry.ref}"`,
      `"${entry.party.replace(/"/g, '""')}"`,
      entry.amount.toFixed(2),
      entry.paid.toFixed(2),
      balance.toFixed(2),
      entry.dueDate,
      `"${entry.terms}"`,
      `"${entry.status}"`,
      `"${(entry.notes || '').replace(/"/g, '""')}"`
    ].join(",");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `wholesale_ledger_export_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Ledger CSV report downloaded successfully!", "success");
}

/* ==========================================================================
   CRUD OPERATIONS (Add, Edit, Adjust, Delete)
   ========================================================================== */

function openAddItemModal() {
  editingItemId = null;
  document.getElementById("form-add-item").reset();
  document.getElementById("modal-item-title").textContent = "Add New Hardware Item";
  openModal("modal-add-item");
}

function openEditModal(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  editingItemId = id;
  document.getElementById("modal-item-title").textContent = "Edit Hardware Item";
  
  document.getElementById("item-name").value = item.name;
  document.getElementById("item-sku").value = item.sku;
  document.getElementById("item-category").value = item.category;
  document.getElementById("item-location").value = item.location;
  document.getElementById("item-stock").value = item.stock;
  document.getElementById("item-min").value = item.minThreshold;
  document.getElementById("item-cost").value = item.cost;
  document.getElementById("item-contractor-price").value = item.contractorPrice;
  document.getElementById("item-supplier").value = item.supplier;

  openModal("modal-add-item");
}

function saveItem() {
  const name = document.getElementById("item-name").value.trim();
  const sku = document.getElementById("item-sku").value.trim();
  const category = document.getElementById("item-category").value;
  const location = document.getElementById("item-location").value.trim();
  const stock = parseInt(document.getElementById("item-stock").value, 10) || 0;
  const minThreshold = parseInt(document.getElementById("item-min").value, 10) || 10;
  const cost = parseFloat(document.getElementById("item-cost").value) || 0;
  const contractorPrice = parseFloat(document.getElementById("item-contractor-price").value) || (cost * 1.35);
  const supplier = document.getElementById("item-supplier").value.trim() || "Apex Wholesale Distribution";

  if (!name || !sku) {
    showToast("Please fill in required fields (Name and SKU)", "warning");
    return;
  }

  if (editingItemId) {
    // Update existing
    const index = inventoryData.findIndex(i => i.id === editingItemId);
    if (index !== -1) {
      inventoryData[index] = {
        ...inventoryData[index],
        name,
        sku,
        category,
        location,
        stock,
        minThreshold,
        cost,
        contractorPrice,
        bulkPrice: parseFloat((contractorPrice * 0.9).toFixed(2)),
        msrp: parseFloat((contractorPrice * 1.3).toFixed(2)),
        supplier
      };
      showToast(`Updated "${name}" successfully`, "success");
    }
  } else {
    // Create new
    const newId = inventoryData.length > 0 ? Math.max(...inventoryData.map(i => i.id)) + 1 : 1;
    inventoryData.unshift({
      id: newId,
      name,
      sku,
      category,
      location,
      stock,
      minThreshold,
      cost,
      contractorPrice,
      bulkPrice: parseFloat((contractorPrice * 0.9).toFixed(2)),
      msrp: parseFloat((contractorPrice * 1.3).toFixed(2)),
      supplier
    });
    showToast(`Added "${name}" to inventory`, "success");
  }

  closeAllModals();
  renderAllViews();
}

function openAdjustModal(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  document.getElementById("adjust-item-id").value = item.id;
  document.getElementById("adjust-item-name").textContent = item.name;
  document.getElementById("adjust-current-stock").textContent = `${item.stock} units`;
  document.getElementById("adjust-qty").value = "";
  
  openModal("modal-adjust-stock");
}

function applyStockAdjustment() {
  const id = parseInt(document.getElementById("adjust-item-id").value, 10);
  const type = document.getElementById("adjust-type").value;
  const qty = parseInt(document.getElementById("adjust-qty").value, 10);

  if (isNaN(qty) || qty <= 0) {
    showToast("Please enter a valid positive quantity", "warning");
    return;
  }

  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  if (type === "add") {
    item.stock += qty;
    showToast(`Added ${qty} units to ${item.name}`, "success");
  } else if (type === "remove") {
    if (qty > item.stock) {
      showToast("Cannot remove more than current stock quantity", "warning");
      return;
    }
    item.stock -= qty;
    showToast(`Removed ${qty} units from ${item.name}`, "info");
  } else if (type === "set") {
    item.stock = qty;
    showToast(`Set stock for ${item.name} to ${qty}`, "info");
  }

  closeAllModals();
  renderAllViews();
}

function quickReorder(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  const reorderQty = item.minThreshold * 2;
  item.stock += reorderQty;
  showToast(`Reorder PO created! Added ${reorderQty} units to ${item.name}`, "success");
  renderAllViews();
}

function deleteItem(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  if (confirm(`Are you sure you want to delete "${item.name}" (${item.sku})?`)) {
    inventoryData = inventoryData.filter(i => i.id !== id);
    showToast(`Deleted ${item.name}`, "info");
    renderAllViews();
  }
}

function applyBulkPriceChange() {
  const targetCategory = document.getElementById("bulk-category").value;
  const percent = parseFloat(document.getElementById("bulk-percent").value);

  if (isNaN(percent) || percent === 0) {
    showToast("Please enter a valid percentage adjustment", "warning");
    return;
  }

  const factor = 1 + (percent / 100);
  let count = 0;

  inventoryData.forEach(item => {
    if (targetCategory === "All" || item.category === targetCategory) {
      item.contractorPrice = parseFloat((item.contractorPrice * factor).toFixed(2));
      item.bulkPrice = parseFloat((item.bulkPrice * factor).toFixed(2));
      item.msrp = parseFloat((item.msrp * factor).toFixed(2));
      count++;
    }
  });

  closeAllModals();
  renderPricesTable();
  showToast(`Adjusted prices by ${percent > 0 ? '+' : ''}${percent}% for ${count} items`, "success");
}

/* ==========================================================================
   EXPORT TO CSV
   ========================================================================== */
function exportCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "ID,SKU,Product Name,Category,Location,Stock Qty,Min Threshold,Wholesale Cost,Contractor Price,Bulk Price,MSRP,Supplier\n";

  inventoryData.forEach(item => {
    const row = [
      item.id,
      `"${item.sku}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      `"${item.location}"`,
      item.stock,
      item.minThreshold,
      item.cost.toFixed(2),
      item.contractorPrice.toFixed(2),
      item.bulkPrice.toFixed(2),
      item.msrp.toFixed(2),
      `"${item.supplier.replace(/"/g, '""')}"`
    ].join(",");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `hardware_inventory_export_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Inventory CSV report generated and downloaded!", "success");
}

/* ==========================================================================
   FILTER EVENT LISTENERS
   ========================================================================== */
function filterCategory(cat) {
  selectedCategory = cat;
  renderStockTable();
  renderPricesTable();
}

function filterStockStatus(status) {
  selectedStockStatus = status;
  renderStockTable();
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3500);
}
