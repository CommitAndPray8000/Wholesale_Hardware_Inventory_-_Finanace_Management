/* ==========================================================================
   APPLICATION ENTRY POINT & BOOTSTRAPPER
   ========================================================================== */

function initApp() {
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
  document.addEventListener("DOMContentLoaded", () => {
    initApp();
    fetchStockItemsFromBackend();
  });
} else {
  initApp();
  fetchStockItemsFromBackend();
}
