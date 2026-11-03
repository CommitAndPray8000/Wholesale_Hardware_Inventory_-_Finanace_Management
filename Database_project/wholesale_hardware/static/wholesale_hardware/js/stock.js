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
