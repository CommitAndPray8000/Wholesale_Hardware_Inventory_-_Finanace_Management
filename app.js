/**
 * Wholesale Hardware Management Platform
 * Interactive Frontend Engine
 */

// Initial Hardware Dataset
const INITIAL_INVENTORY_DATA = [
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
let inventoryData = JSON.parse(JSON.stringify(INITIAL_INVENTORY_DATA));

// Initial Ledger Dataset (Credit & Debt)
const INITIAL_LEDGER_DATA = [
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
let ledgerData = JSON.parse(JSON.stringify(INITIAL_LEDGER_DATA));

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
  initStockPagePopup();
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
    if (targetView === "stock") {
      renderStockTable();
      renderStockPageRecords();
    }
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
  window.openLedgerWithMode = function (mode) {
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
    modal.style.display = "flex";
  }
}

function closeAllModals() {
  document.querySelectorAll(".modal-backdrop").forEach(modal => {
    modal.classList.remove("active");
    modal.style.display = "none";
  });
  editingItemId = null;
}

/* ==========================================================================
   VIEW RENDERING
   ========================================================================== */
function renderAllViews() {
  renderDashboard();
  renderStockTable();
  renderStockPageRecords();
  updateStockPageTotals();
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
          <td style="cursor: pointer;" onclick="openStockItemStats('${item.sku}')" data-stock-sku="${item.sku}" title="Click to view ${item.name} stats & order more">
            <button type="button" class="stock-item-name-btn" onclick="openStockItemStats('${item.sku}'); event.stopPropagation();">
              <span>${item.name}</span>
            </button>
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
        <td style="cursor: pointer;" onclick="openStockItemStats('${item.sku}')" data-stock-sku="${item.sku}" title="Click to view ${item.name} stats & order more">
          <button type="button" class="stock-item-name-btn" onclick="openStockItemStats('${item.sku}'); event.stopPropagation();">
            <span>${item.name}</span>
          </button>
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
  link.setAttribute("download", `wholesale_ledger_export_${new Date().toISOString().slice(0, 10)}.csv`);
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
  link.setAttribute("download", `hardware_inventory_export_${new Date().toISOString().slice(0, 10)}.csv`);
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
}/* ==========================================================================
   STOCK PAGE MODULE (LIVE DJANGO DB INTEGRATION, MULTI-STATUS BADGES, FILTER & ORDER MORE)
   ========================================================================== */

const INITIAL_STOCK_PAGE_INVENTORY = [
  {
    id: 1,
    item_code: 'SKU-9941',
    sku: 'SKU-9941',
    name: 'Heavy Duty Steel Rack',
    category: 'Storage & Shelving',
    supplier: 'Apex Logistics',
    current_quantity: 24,
    low_stock_threshold: 15,
    ordered_quantity: 0,
    delivered_quantity: 24,
    purchase_price: 38500.00,
    selling_price: 45000.00,
    price: 38500.00,
    inStock: '24 pcs'
  },
  {
    id: 2,
    item_code: 'SKU-8822',
    sku: 'SKU-8822',
    name: 'Industrial Pallet Box',
    category: 'Material Handling',
    supplier: 'Global Pack Co.',
    current_quantity: 12,
    low_stock_threshold: 15,
    ordered_quantity: 0,
    delivered_quantity: 12,
    purchase_price: 9800.00,
    selling_price: 12500.00,
    price: 9800.00,
    inStock: '12 pcs'
  },
  {
    id: 3,
    item_code: 'SKU-4402',
    sku: 'SKU-4402',
    name: 'Barcode Scanner Pro',
    category: 'Warehouse Tech',
    supplier: 'TechTrack Solutions',
    current_quantity: 0,
    low_stock_threshold: 10,
    ordered_quantity: 15,
    delivered_quantity: 0,
    purchase_price: 48000.00,
    selling_price: 58000.00,
    price: 48000.00,
    inStock: '0 pcs'
  },
  {
    id: 4,
    item_code: 'SKU-3120',
    sku: 'SKU-3120',
    name: 'Thermal Label Roll',
    category: 'Packaging & Labels',
    supplier: 'Zebra Supplies',
    current_quantity: 140,
    low_stock_threshold: 30,
    ordered_quantity: 0,
    delivered_quantity: 140,
    purchase_price: 3600.00,
    selling_price: 4800.00,
    price: 3600.00,
    inStock: '140 rolls'
  },
  {
    id: 5,
    item_code: 'SKU-5520',
    sku: 'SKU-5520',
    name: 'Heavy Duty Air Compressor',
    category: 'Power Tools',
    supplier: 'Bostitch Tools',
    current_quantity: 0,
    low_stock_threshold: 5,
    ordered_quantity: 0,
    delivered_quantity: 5,
    purchase_price: 72000.00,
    selling_price: 89000.00,
    price: 72000.00,
    inStock: '0 pcs'
  }
];
let stockPageInventory = JSON.parse(JSON.stringify(INITIAL_STOCK_PAGE_INVENTORY));

let isStockEmptyState = false;
let currentStockStatusFilter = null; // null | 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Ordered'
let currentStatsItem = null;

// Determine inventory status: In Stock (green), Low Stock (yellow/orange), Out of Stock (red)
function getInventoryStatus(item) {
  const currentQty = item.current_quantity !== undefined ? item.current_quantity : (parseInt(item.inStock) || 0);
  const threshold = item.low_stock_threshold || item.minThreshold || 15;
  if (currentQty <= 0) return 'Out of Stock';
  if (currentQty <= threshold) return 'Low Stock';
  return 'In Stock';
}

// Determine if item has an active pending delivery order (Ordered - blue)
function getOrderedStatus(item) {
  return (item.ordered_quantity || 0) > 0;
}

// Return list of all active status strings for the item
function getItemStatuses(item) {
  const list = [getInventoryStatus(item)];
  if (getOrderedStatus(item)) {
    list.push('Ordered');
  }
  return list;
}

// Generate styled HTML badges supporting simultaneous inventory and ordered statuses
function getItemStatusBadgesHtml(item) {
  const invStatus = getInventoryStatus(item);
  const isOrdered = getOrderedStatus(item);

  let html = `<div class="status-badges-container">`;
  if (invStatus === 'In Stock') {
    html += `<span class="badge-status-in-stock">In Stock</span>`;
  } else if (invStatus === 'Low Stock') {
    html += `<span class="badge-status-low-stock">Low Stock</span>`;
  } else {
    html += `<span class="badge-status-out-of-stock">Out of Stock</span>`;
  }

  // Independently show "Ordered" badge whenever item has pending delivery
  if (isOrdered) {
    html += `<span class="badge-status-ordered">Ordered</span>`;
  }
  html += `</div>`;
  return html;
}

// In-memory testing mode: initialize and render stock records from in-memory sample dataset
function fetchStockItemsFromBackend() {
  updateStockPageTotals();
  renderStockPageRecords();
}

/* ==========================================================================
   FILTER DROPDOWN CONTROLS (In Stock, Low Stock, Out of Stock, Ordered)
   ========================================================================== */
function toggleStockFilterMenu(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const menu = document.getElementById('stock-filter-menu');
  const chevron = document.getElementById('stock-filter-chevron');
  if (!menu) return;
  const isHidden = menu.style.display === 'none' || !menu.style.display;
  menu.style.display = isHidden ? 'block' : 'none';
  if (chevron) {
    chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
  }
}

function closeStockFilterMenu() {
  const menu = document.getElementById('stock-filter-menu');
  const chevron = document.getElementById('stock-filter-chevron');
  if (menu) menu.style.display = 'none';
  if (chevron) chevron.style.transform = 'rotate(0deg)';
}

function selectStockFilter(statusOption) {
  // If user clicks the currently selected filter, clear it (toggle off)
  if (currentStockStatusFilter === statusOption) {
    currentStockStatusFilter = null;
  } else {
    currentStockStatusFilter = statusOption;
  }
  updateFilterUIState();
  closeStockFilterMenu();
  renderStockPageRecords();
}

function updateFilterUIState() {
  const btn = document.getElementById('stock-filter-btn');
  const btnText = document.getElementById('stock-filter-btn-text');
  const checkIn = document.getElementById('check-in-stock');
  const checkLow = document.getElementById('check-low-stock');
  const checkOut = document.getElementById('check-out-of-stock');
  const checkOrdered = document.getElementById('check-ordered');

  if (checkIn) checkIn.style.display = currentStockStatusFilter === 'In Stock' ? 'inline-block' : 'none';
  if (checkLow) checkLow.style.display = currentStockStatusFilter === 'Low Stock' ? 'inline-block' : 'none';
  if (checkOut) checkOut.style.display = currentStockStatusFilter === 'Out of Stock' ? 'inline-block' : 'none';
  if (checkOrdered) checkOrdered.style.display = currentStockStatusFilter === 'Ordered' ? 'inline-block' : 'none';

  if (currentStockStatusFilter) {
    if (btnText) btnText.textContent = `Filter: ${currentStockStatusFilter}`;
    if (btn) btn.classList.add('filter-active');
  } else {
    if (btnText) btnText.textContent = 'Filter';
    if (btn) btn.classList.remove('filter-active');
  }
}

// Close filter popup on clicking outside
document.addEventListener('click', function (e) {
  const wrapper = document.getElementById('stock-filter-wrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    closeStockFilterMenu();
  }
});

/* ==========================================================================
   RENDER STOCK TABLE & TOTALS
   ========================================================================== */
function renderStockPageRecords(filterText = '') {
  const tbody = document.getElementById('stock-page-tbody');
  const tableWrapper = document.getElementById('stock-table-wrapper');
  const emptyStateView = document.getElementById('stock-empty-state-view');
  const recordCountHeader = document.getElementById('stock-page-record-count');
  const navBadgeStock = document.getElementById('nav-badge-stock');

  if (!tbody) return;

  const isEmpty = stockPageInventory.length === 0;
  if (isEmpty) {
    if (tableWrapper) tableWrapper.style.display = 'none';
    if (emptyStateView) emptyStateView.style.display = 'block';
    if (recordCountHeader) recordCountHeader.textContent = 'Active Inventory Records (0 Items)';
    if (navBadgeStock) navBadgeStock.textContent = '0';
    return;
  } else {
    if (tableWrapper) tableWrapper.style.display = 'block';
    if (emptyStateView) emptyStateView.style.display = 'none';
  }

  tbody.innerHTML = '';
  const query = (filterText || (typeof searchTerm !== 'undefined' ? searchTerm : '')).toLowerCase().trim();

  const filtered = stockPageInventory.filter(item => {
    // Text search filter
    const matchesQuery = !query ||
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.sku && item.sku.toLowerCase().includes(query)) ||
      (item.item_code && item.item_code.toLowerCase().includes(query)) ||
      (item.supplier && item.supplier.toLowerCase().includes(query));

    // Status filter
    let matchesStatus = true;
    if (currentStockStatusFilter) {
      const invStatus = getInventoryStatus(item);
      const isOrdered = getOrderedStatus(item);

      if (currentStockStatusFilter === 'Ordered') {
        // Includes every item with a pending order, even if In Stock, Low Stock, or Out of Stock!
        matchesStatus = isOrdered;
      } else if (currentStockStatusFilter === 'In Stock') {
        matchesStatus = invStatus === 'In Stock';
      } else if (currentStockStatusFilter === 'Low Stock') {
        matchesStatus = invStatus === 'Low Stock';
      } else if (currentStockStatusFilter === 'Out of Stock') {
        matchesStatus = invStatus === 'Out of Stock';
      }
    }

    return matchesQuery && matchesStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="padding: 36px 20px; text-align: center; color: #94a3b8; font-size: 13.5px;">
          No matching stock records found ${currentStockStatusFilter ? `for filter "${currentStockStatusFilter}"` : ''}.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(item => {
    const invStatus = getInventoryStatus(item);
    const sku = item.item_code || item.sku;
    const purchasePrice = Number(item.purchase_price || item.price || 0);
    const sellingPrice = Number(item.selling_price || 0);
    const currentQty = item.current_quantity !== undefined ? item.current_quantity : (parseInt(item.inStock) || 0);

    const row = document.createElement('tr');
    row.style.borderBottom = '1px solid #f1f5f9';
    row.innerHTML = `
      <td style="padding: 14px 20px; color: #94a3b8; font-family: monospace; font-size: 12.5px;">${sku}</td>
      <td style="padding: 14px 20px; cursor: pointer;" onclick="openStockItemStats('${sku}')" data-stock-sku="${sku}" title="Click to view ${item.name} details & statistics">
        <button type="button" class="stock-item-name-btn" onclick="openStockItemStats('${sku}'); event.stopPropagation();">
          <span>${item.name}</span>
        </button>
      </td>
      <td style="padding: 14px 20px; color: #475569; font-size: 13px;">${item.supplier || '-'}</td>
      <td style="padding: 14px 20px; font-weight: 600; color: #0f172a;">PKR ${purchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style="padding: 14px 20px; font-weight: 600; color: ${invStatus === 'Out of Stock' ? '#dc2626' : (invStatus === 'Low Stock' ? '#d97706' : '#475569')}; font-size: 13px;">
        ${currentQty} pcs
      </td>
      <td style="padding: 14px 20px;">
        ${getItemStatusBadgesHtml(item)}
      </td>
      <td style="padding: 14px 20px; text-align: right; font-weight: 700; color: #0f172a; font-size: 13px;">
        PKR ${sellingPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
    `;
    tbody.appendChild(row);
  });

  if (recordCountHeader) {
    recordCountHeader.textContent = `Active Inventory Records (${stockPageInventory.length} Items)`;
  }
  if (navBadgeStock) {
    navBadgeStock.textContent = stockPageInventory.length;
  }
}

function updateStockPageTotals() {
  const valueDisplay = document.getElementById('stock-page-total-value');
  const unitDisplay = document.getElementById('stock-page-total-unit');
  if (!valueDisplay || !unitDisplay) return;

  let totalUnits = 0;
  let totalValue = 0;

  stockPageInventory.forEach(item => {
    const units = item.current_quantity !== undefined ? item.current_quantity : (parseInt(item.inStock) || item.units || 0);
    const price = Number(item.selling_price || item.purchase_price || 0);
    totalUnits += units;
    totalValue += (price * units);
  });

  unitDisplay.textContent = `${totalUnits} pcs`;
  valueDisplay.textContent = `PKR ${Math.round(totalValue).toLocaleString()}`;
}

function toggleStockEmptyState() {
  isStockEmptyState = !isStockEmptyState;
  const btn = document.getElementById('stock-toggle-empty-btn');
  if (btn) {
    btn.textContent = isStockEmptyState ? 'Show Inventory' : 'Toggle Empty State';
  }
  renderStockPageRecords();
}

/* ==========================================================================
   ITEM DETAILS & 9-STATISTICS POPUP
   ========================================================================== */
function openStockItemStats(skuOrId) {
  if (!skuOrId) return;
  const searchVal = String(skuOrId).trim().toLowerCase();

  let item = stockPageInventory.find(i =>
    (i.item_code && i.item_code.toLowerCase() === searchVal) ||
    (i.sku && i.sku.toLowerCase() === searchVal) ||
    (i.name && i.name.toLowerCase() === searchVal) ||
    String(i.id) === searchVal
  );

  // Fallback: check inventoryData
  if (!item && typeof inventoryData !== 'undefined') {
    const inv = inventoryData.find(i =>
      (i.sku && i.sku.toLowerCase() === searchVal) ||
      (i.name && i.name.toLowerCase() === searchVal) ||
      String(i.id) === searchVal
    );
    if (inv) {
      item = {
        id: inv.id,
        item_code: inv.sku,
        sku: inv.sku,
        name: inv.name,
        category: inv.category || 'Hardware',
        supplier: inv.supplier || 'Apex Hardware Distribution',
        current_quantity: inv.stock || 0,
        low_stock_threshold: inv.minThreshold || 15,
        ordered_quantity: 0,
        delivered_quantity: inv.stock || 0,
        purchase_price: inv.cost || 0,
        selling_price: inv.contractorPrice || inv.msrp || (inv.cost * 1.25),
        price: inv.cost || 0,
        inStock: `${inv.stock || 0} pcs`
      };
      stockPageInventory.push(item);
    }
  }

  if (!item) {
    if (typeof showToast === 'function') showToast('Stock item record not found', 'warning');
    return;
  }

  currentStatsItem = item;

  // Header Title
  const headerTitle = document.getElementById('stats-popup-header-title');
  if (headerTitle) headerTitle.textContent = `${item.name} - Statistics`;

  // 1. Item Name
  const nameBox = document.getElementById('stats-display-name');
  if (nameBox) nameBox.textContent = item.name;

  // 2. Item Code
  const codeBox = document.getElementById('stats-display-code');
  if (codeBox) codeBox.textContent = item.item_code || item.sku;

  // 3. Category
  const catBox = document.getElementById('stats-display-category');
  if (catBox) catBox.textContent = item.category || 'Hardware';

  // 4. Stock Status (Supports simultaneous inventory status & ordered badge)
  const statusBox = document.getElementById('stats-display-status');
  if (statusBox) statusBox.innerHTML = getItemStatusBadgesHtml(item);

  // 5. Current Quantity
  const currentQty = item.current_quantity !== undefined ? item.current_quantity : (parseInt(item.inStock) || 0);
  const currentQtyBox = document.getElementById('stats-display-current-qty');
  if (currentQtyBox) currentQtyBox.textContent = `${currentQty} pcs`;

  // 6. Ordered Quantity
  const orderedQtyBox = document.getElementById('stats-display-ordered-qty');
  if (orderedQtyBox) orderedQtyBox.textContent = `${item.ordered_quantity || 0} pcs`;

  // 7. Delivered Quantity
  const deliveredQtyBox = document.getElementById('stats-display-delivered-qty');
  if (deliveredQtyBox) deliveredQtyBox.textContent = `${item.delivered_quantity || 0} pcs`;

  // 8. Purchase Price
  const purchasePrice = Number(item.purchase_price || item.price || 0);
  const purchaseBox = document.getElementById('stats-display-purchase-price');
  if (purchaseBox) purchaseBox.textContent = `PKR ${purchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // 9. Selling Price
  const sellingPrice = Number(item.selling_price || 0);
  const sellingBox = document.getElementById('stats-display-selling-price');
  if (sellingBox) sellingBox.textContent = `PKR ${sellingPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Supplier
  const supplierBox = document.getElementById('stats-display-supplier');
  if (supplierBox) supplierBox.textContent = item.supplier || 'Apex Logistics';

  // Hide order form initially
  cancelOrderMoreForm();

  // Show modal
  const modal = document.getElementById('modal-stock-item-stats');
  if (modal) {
    if (typeof closeAllDropdowns === 'function') closeAllDropdowns();
    modal.classList.add('active');
    modal.style.display = 'flex';
  } else if (typeof openModal === 'function') {
    openModal('modal-stock-item-stats');
  }
}

/* ==========================================================================
   ORDER MORE WORKFLOW (SAVE TO DJANGO DB, UPDATE ORDERED QTY, PRESERVE AVAILABLE STOCK)
   ========================================================================== */
function showOrderMoreForm() {
  if (!currentStatsItem) return;
  const wrapper = document.getElementById('stats-order-more-form-wrapper');
  const itemNameInput = document.getElementById('order-form-item-name');
  const supplierInput = document.getElementById('order-form-supplier');
  const qtyInput = document.getElementById('order-form-quantity');
  const noteInput = document.getElementById('order-form-note');
  const footerBtnText = document.getElementById('btn-footer-order-more-text');

  if (itemNameInput) itemNameInput.value = `${currentStatsItem.name} (${currentStatsItem.item_code || currentStatsItem.sku})`;
  if (supplierInput) supplierInput.value = currentStatsItem.supplier || 'Apex Logistics';
  if (qtyInput) qtyInput.value = '10';
  if (noteInput) noteInput.value = '';

  if (wrapper) {
    const isHidden = wrapper.style.display === 'none' || !wrapper.style.display;
    if (isHidden) {
      wrapper.style.display = 'block';
      if (footerBtnText) footerBtnText.textContent = 'Hide Order Form';
      if (qtyInput) {
        qtyInput.focus();
        qtyInput.select();
      }
    } else {
      wrapper.style.display = 'none';
      if (footerBtnText) footerBtnText.textContent = 'Order More';
    }
  }
}

function cancelOrderMoreForm() {
  const wrapper = document.getElementById('stats-order-more-form-wrapper');
  const footerBtnText = document.getElementById('btn-footer-order-more-text');
  if (wrapper) wrapper.style.display = 'none';
  if (footerBtnText) footerBtnText.textContent = 'Order More';
}

async function handleOrderMoreSubmit(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (!currentStatsItem) return;

  const qtyInput = document.getElementById('order-form-quantity');
  const supplierInput = document.getElementById('order-form-supplier');
  const noteInput = document.getElementById('order-form-note');
  const submitBtn = document.getElementById('btn-submit-place-order');

  const quantity = parseInt(qtyInput ? qtyInput.value : 0);
  const supplier = supplierInput ? supplierInput.value.trim() : (currentStatsItem.supplier || 'Apex Logistics');
  const note = noteInput ? noteInput.value.trim() : '';

  if (!quantity || quantity <= 0) {
    if (typeof showToast === 'function') showToast('Please enter a valid quantity to order', 'warning');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Placing Order...';
  }

  try {
    // In-memory testing mode: update item without persisting to database or storage
    currentStatsItem.ordered_quantity = (currentStatsItem.ordered_quantity || 0) + quantity;

    // Update the item in stockPageInventory array
    const idx = stockPageInventory.findIndex(i =>
      (i.item_code && i.item_code === currentStatsItem.item_code) ||
      (i.sku && i.sku === currentStatsItem.sku)
    );
    if (idx !== -1) {
      stockPageInventory[idx] = currentStatsItem;
    }

    // Refresh popup statistics display live with multi-status badges (e.g. In Stock AND Ordered)
    const orderedQtyBox = document.getElementById('stats-display-ordered-qty');
    if (orderedQtyBox) orderedQtyBox.textContent = `${currentStatsItem.ordered_quantity} pcs`;

    const statusBox = document.getElementById('stats-display-status');
    if (statusBox) statusBox.innerHTML = getItemStatusBadgesHtml(currentStatsItem);

    // Update background table and summary totals immediately
    updateStockPageTotals();
    renderStockPageRecords();

    // Hide order form
    cancelOrderMoreForm();

    const successMsg = `Successfully placed order for ${quantity} units of "${currentStatsItem.name}". Available stock will update upon delivery.`;

    if (typeof showToast === 'function') {
      showToast(successMsg, 'success');
    }

  } catch (err) {
    if (typeof showToast === 'function') {
      showToast('Error placing order: ' + err.message, 'danger');
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Place Order
      `;
    }
  }
}

/* ==========================================================================
   ADD STOCK POPUP (+ Add Item) INTEGRATION
   ========================================================================== */
function initStockPagePopup() {
  const form = document.getElementById('form-add-stock-popup');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('popup-item-name');
    const skuInput = document.getElementById('popup-sku');
    const supplierInput = document.getElementById('popup-supplier');
    const priceInput = document.getElementById('popup-price');
    const inStockInput = document.getElementById('popup-in-stock');

    const name = nameInput.value.trim();
    const sku = skuInput.value.trim();
    const supplier = supplierInput.value.trim();
    const rawPrice = priceInput.value.replace(/[^0-9.]/g, '');
    const price = parseFloat(rawPrice) || 0;
    const inStockVal = inStockInput.value.trim();

    if (!name || !sku || !supplier || !inStockVal) {
      if (typeof showToast === 'function') showToast('Please fill all required fields', 'warning');
      return;
    }

    const numMatch = inStockVal.match(/\d+/);
    const units = numMatch ? parseInt(numMatch[0]) : 0;
    const itemCode = sku.toUpperCase().startsWith('SKU-') ? sku.toUpperCase() : `SKU-${sku.toUpperCase()}`;
    const sellingPrice = Math.round(price * 1.25);
    const status = units > 0 ? 'In Stock' : 'Out of Stock';

    const newItem = {
      id: Date.now(),
      name: name,
      item_code: itemCode,
      sku: itemCode,
      category: 'Hardware',
      supplier: supplier,
      current_quantity: units,
      ordered_quantity: 0,
      delivered_quantity: units,
      purchase_price: price,
      selling_price: sellingPrice,
      price: price,
      inStock: `${units} pcs`,
      status: status
    };

    // In-memory testing mode: add to in-memory stock dataset immediately without persistent storage
    stockPageInventory.unshift(newItem);
    isStockEmptyState = false;
    const emptyBtn = document.getElementById('stock-toggle-empty-btn');
    if (emptyBtn) emptyBtn.textContent = 'Toggle Empty State';

    updateStockPageTotals();
    renderStockPageRecords();
    if (typeof closeAllModals === 'function') closeAllModals();
    form.reset();
    if (typeof showToast === 'function') {
      showToast(`Added "${name}" to stock!`, 'success');
    }
  });
}

// Global window exposure & Delegated Event Listeners
window.openStockItemStats = openStockItemStats;
window.toggleStockFilterMenu = toggleStockFilterMenu;
window.closeStockFilterMenu = closeStockFilterMenu;
window.selectStockFilter = selectStockFilter;
window.showOrderMoreForm = showOrderMoreForm;
window.cancelOrderMoreForm = cancelOrderMoreForm;
window.handleOrderMoreSubmit = handleOrderMoreSubmit;
window.renderStockPageRecords = renderStockPageRecords;
window.updateStockPageTotals = updateStockPageTotals;

// Helper to reset all datasets to default sample data programmatically
window.resetToSampleData = function () {
  inventoryData = JSON.parse(JSON.stringify(INITIAL_INVENTORY_DATA));
  ledgerData = JSON.parse(JSON.stringify(INITIAL_LEDGER_DATA));
  stockPageInventory = JSON.parse(JSON.stringify(INITIAL_STOCK_PAGE_INVENTORY));
  isStockEmptyState = false;
  currentStockStatusFilter = null;
  editingItemId = null;
  settlingLedgerId = null;
  currentStatsItem = null;
  renderAllViews();
  if (typeof showToast === 'function') {
    showToast('Sample data restored to original initial state.', 'info');
  }
};

// Delegated click listener for item names
document.addEventListener('click', function (e) {
  const trigger = e.target.closest('.stock-item-name-btn, .stock-item-name-link, [data-stock-sku]');
  if (trigger) {
    const sku = trigger.getAttribute('data-stock-sku') || trigger.getAttribute('data-sku');
    if (sku) {
      e.preventDefault();
      openStockItemStats(sku);
    }
  }
});

// Auto-sync with Django backend on initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fetchStockItemsFromBackend);
} else {
  fetchStockItemsFromBackend();
}

