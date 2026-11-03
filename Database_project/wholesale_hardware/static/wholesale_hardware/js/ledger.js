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

