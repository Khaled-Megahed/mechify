/**
 * MAIN CONTROLLER
 * Orchestrates application state, routing, and global event delegation.
 */
import { Model } from "./model.js";
import { DashboardView } from "./views/DashboardView.js";
import { CustomersView } from "./views/CustomersView.js";
import { ServicesView } from "./views/ServicesView.js";
import { ScheduleView } from "./views/ScheduleView.js";
import { WorkOrderView } from "./views/WorkOrderView.js";

// --- 1. AUTHENTICATION GUARD ---
(function checkAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("userRole");

  if (isLoggedIn !== "true" || !role || role.toLowerCase() !== "manager") {
    window.location.href = "/src/pages/login.html";
  }
})();

// --- 2. CONFIGURATION ---
const views = {
  dashboard: DashboardView,
  customers: CustomersView,
  services: ServicesView,
  schedule: ScheduleView,
  workOrders: WorkOrderView,
};

let scheduleRefreshInterval = null;

// --- 3. NAVIGATION & VIEW ENGINE ---
window.switchTab = function (tabId) {
  const container = document.getElementById("tab-content");
  if (!container) return;

  // Cleanup active intervals to prevent memory leaks
  if (scheduleRefreshInterval) {
    clearInterval(scheduleRefreshInterval);
    scheduleRefreshInterval = null;
  }

  const normalizedId =
    tabId.toLowerCase() === "workorders" ? "workOrders" : tabId;

  // Update Navigation UI
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    const onClickAttr = btn.getAttribute("onclick") || "";
    btn.classList.toggle(
      "active",
      onClickAttr.toLowerCase().includes(tabId.toLowerCase()),
    );
  });

  // Loading State Transition
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
      <div class="w-10 h-10 border-2 border-slate-800 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
      <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Syncing Neural Link...</p>
    </div>`;

  setTimeout(() => {
    container.innerHTML = views[normalizedId]
      ? views[normalizedId].render()
      : DashboardView.render();

    // Contextual Initialization
    if (normalizedId === "schedule") {
      ScheduleView.renderScheduleGrid();
      ScheduleView.scrollScheduleToTime();
      scheduleRefreshInterval = setInterval(
        () => ScheduleView.renderScheduleGrid(),
        60000,
      );
    }
  }, 350);
};

// --- 4. GLOBAL EVENT DELEGATION ---

// Schedule Bridge
window.renderScheduleGrid = () => ScheduleView.renderScheduleGrid();
window.changeScheduleDate = (date) => ScheduleView.changeScheduleDate(date);
window.openScheduleModal = (mId, sIdx) =>
  ScheduleView.openScheduleModal(mId, sIdx);
window.editScheduleItem = (mId, sIdx, oId) =>
  ScheduleView.editScheduleItem(mId, sIdx, oId);
window.saveScheduleItem = (e) => ScheduleView.saveScheduleItem(e);
window.removeScheduleItem = (mId, sIdx) =>
  ScheduleView.removeScheduleItem(mId, sIdx);
window.closeScheduleModal = () => ScheduleView.closeScheduleModal();
window.handleCustomerSelection = (v) => ScheduleView.handleCustomerSelection(v);
window.updateCalculatedTime = () => ScheduleView.updateCalculatedTime();

// Work Order Bridge
window.changeWorkOrderDate = function (newDate) {
  Model.currentActiveDate = newDate;
  // Re-render tab to reflect the schedule of the new date
  window.switchTab("workOrders");
};

window.renderFilteredWorkOrders = function (status) {
  const container = document.getElementById("tab-content");
  if (container) {
    // Re-renders only the inner content of the current view with the filter applied
    container.innerHTML = WorkOrderView.render(status);
  }
};

// --- 5. INITIALIZATION & UTILS ---
window.logout = () => {
  localStorage.clear();
  window.location.href = "/src/pages/login.html";
};

document.addEventListener("DOMContentLoaded", () => {
  const email = localStorage.getItem("userEmail") || "manager@garage.com";
  const emailDisplay = document.getElementById("user-display-email");
  const initialDisplay = document.getElementById("user-initials");

  if (emailDisplay) emailDisplay.textContent = email;
  if (initialDisplay)
    initialDisplay.textContent = email.charAt(0).toUpperCase();

  window.switchTab("dashboard");
});
