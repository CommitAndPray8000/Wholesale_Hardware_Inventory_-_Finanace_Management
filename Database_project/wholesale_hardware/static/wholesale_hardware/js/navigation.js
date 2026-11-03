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
