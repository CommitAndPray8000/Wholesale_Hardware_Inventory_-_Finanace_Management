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
