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
