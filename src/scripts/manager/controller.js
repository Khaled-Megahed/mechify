/**
 * MAIN CONTROLLER
 * Orchestrates application state, routing, and global event delegation.
 * Connected to .NET Backend at http://localhost:5107
 */
import { logout, requireRole } from "../auth-helper.js";
import { Model } from "./model.js";
import { dashboardView } from "./views/DashboardView.js";
import { customersView } from "./views/CustomersView.js";
import { servicesView } from "./views/ServicesView.js";
import { scheduleView } from "./views/ScheduleView.js";
import { workOrderView } from "./views/WorkOrderView.js";

// --- 1. AUTHENTICATION GUARD ---
(function checkAuth() {
  requireRole("Manager");
})();

// --- 2. CONFIGURATION ---

/**
 * [DESIGN PATTERN: FACTORY METHOD]
 * Interface (Base Creator): Defines the method for creating objects.
 */
class ViewCreator {
  /** The Factory Method */
  createView(tabId) {
    throw new Error("createView() must be implemented by subclasses");
  }
}

/**
 * Concrete Creator: Decides which specific View class to instantiate/return.
 * The client (Controller) refers to the result via a common interface (.render()).
 */
class ManagerViewCreator extends ViewCreator {
  createView(tabId) {
    const id = tabId.toLowerCase();
    switch (id) {
      case "dashboard":
        return dashboardView;
      case "customers":
        return customersView;
      case "services":
        return servicesView;
      case "schedule":
        return scheduleView;
      case "workorders":
        return workOrderView;
      default:
        return dashboardView;
    }
  }
}

const viewCreator = new ManagerViewCreator();
let scheduleRefreshInterval = null;

// --- 3. NAVIGATION & VIEW ENGINE ---
window.switchTab = async function (tabId) {
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

  // Loading State UI
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-100 animate-fade-in">
      <div class="w-10 h-10 border-2 border-slate-800 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
      <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Syncing Neural Link...</p>
    </div>`;

  // Fetch fresh data for specific views before rendering
  if (normalizedId === "schedule") {
    await Model.refreshSchedule(Model.currentActiveDate);
  } else if (normalizedId === "workOrders" || normalizedId === "dashboard") {
    await Model.init();
  }

  // Slight delay for the animation feel
  setTimeout(() => {
    const view = viewCreator.createView(tabId);
    container.innerHTML = view.render();

    // Contextual Initialization
    if (normalizedId === "schedule") {
      scheduleView.renderScheduleGrid();
      scheduleView.scrollScheduleToTime();
      // Auto-refresh every minute to stay synced with mechanic updates
      scheduleRefreshInterval = setInterval(async () => {
        await Model.refreshSchedule(Model.currentActiveDate);
        scheduleView.renderScheduleGrid();
      }, 60000);
    }
  }, 350);
};

// --- 4. GLOBAL EVENT DELEGATION ---
// (Bridges remain mostly the same, but ensure they interact with Model async methods)
window.renderScheduleGrid = () => scheduleView.renderScheduleGrid();
window.changeScheduleDate = async (date) => {
  Model.currentActiveDate = date;
  await Model.refreshSchedule(date); // Fetch data for the new date
  scheduleView.renderScheduleGrid();
};

window.openScheduleModal = (mId, sIdx) =>
  scheduleView.openScheduleModal(mId, sIdx);
window.editScheduleItem = (mId, sIdx, oId) =>
  scheduleView.editScheduleItem(mId, sIdx, oId);
window.viewOrderDetails = (orderId) => scheduleView.viewOrderDetails(orderId);
window.saveScheduleItem = (e) => scheduleView.saveScheduleItem(e);
window.removeScheduleItem = (mId, sIdx) =>
  scheduleView.removeScheduleItem(mId, sIdx);
window.closeScheduleModal = () => scheduleView.closeScheduleModal();
window.handleCustomerSelection = (v) => scheduleView.handleCustomerSelection(v);
window.updateCalculatedTime = () => scheduleView.updateCalculatedTime();

window.changeWorkOrderDate = async function (newDate) {
  Model.currentActiveDate = newDate;
  await Model.refreshSchedule(newDate);
  window.switchTab("workOrders");
};

window.renderFilteredWorkOrders = function (status) {
  const container = document.getElementById("tab-content");
  if (container) {
    container.innerHTML = workOrderView.render(status);
  }
};

// --- 5. INITIALIZATION ---
window.logout = logout;

document.addEventListener("DOMContentLoaded", async () => {
  const email = localStorage.getItem("userEmail") || "manager@gmail.com";
  const emailDisplay = document.getElementById("user-display-email");
  const initialDisplay = document.getElementById("user-initials");

  if (emailDisplay) emailDisplay.textContent = email;
  if (initialDisplay)
    initialDisplay.textContent = email.charAt(0).toUpperCase();

  // IMPORTANT: Initialize the Model from the API before loading the first tab
  await Model.init();

  // Load the default view
  window.switchTab("dashboard");
});
