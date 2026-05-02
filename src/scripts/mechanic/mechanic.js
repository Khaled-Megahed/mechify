import { authStorage, logout, requireRole } from "../auth-helper.js";
import { MockStore } from "../mockStore.js";

/**
 * [DESIGN PATTERN: FACTORY METHOD]
 * Products: These objects provide a common interface (.render())
 */
const MechanicDashboardProduct = {
  render: () => app.renderDashboard(),
};

const MechanicWorkOrdersProduct = {
  render: () => app.renderWorkOrders(),
};

/**
 * Base Creator Interface
 */
class ViewCreator {
  createView(tabId) {
    throw new Error("Method not implemented");
  }
}

/**
 * Concrete Creator: Hides the logic of which specific mechanic view to return.
 */
class MechanicViewCreator extends ViewCreator {
  createView(tabId) {
    const id = tabId.toLowerCase();
    if (id === "workorders") {
      return MechanicWorkOrdersProduct;
    }
    return MechanicDashboardProduct; // Default
  }
}

const viewCreator = new MechanicViewCreator();

const app = {
  init() {
    if (!requireRole("Mechanic")) {
      return;
    }

    this.initHeader();
    this.switchTab("dashboard");
  },

  initHeader() {
    const email = authStorage.getUserEmail() || "mechanic@gmail.com";
    const role = authStorage.getUserRole() || "Lead Mechanic";

    // Select elements
    const emailDisplay = document.getElementById("user-display-email");
    const roleDisplay = document.getElementById("user-display-role");
    const initialsDisplay = document.getElementById("user-initials");

    // Update content using standard textContent (Safe and universal)
    if (emailDisplay) emailDisplay.textContent = email;
    if (roleDisplay) roleDisplay.textContent = role;
    if (initialsDisplay) initialsDisplay.textContent = email[0].toUpperCase();
  },

  switchTab(tabId) {
    const container = document.getElementById("tab-content");
    if (!container) return;

    // Update Navigation Buttons UI
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.remove("text-emerald-500", "border-emerald-500", "active");
      btn.classList.add("text-slate-400", "border-transparent");
    });

    // Match the active button
    const activeBtn = document.querySelector(`button[onclick*="${tabId}"]`);
    if (activeBtn) {
      activeBtn.classList.remove("text-slate-400", "border-transparent");
      activeBtn.classList.add(
        "text-emerald-500",
        "border-emerald-500",
        "active",
      );
    }

    // Loading State
    container.innerHTML = `
      <div class="flex items-center justify-center h-64">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>`;

    setTimeout(() => {
      const view = viewCreator.createView(tabId);
      container.innerHTML = view.render();
    }, 200);
  },

  updateOrderStatus(orderId, newStatus) {
    MockStore.load(); // Sync with latest manager changes before updating
    const order = MockStore.workOrders.find((o) => o.orderId === orderId);
    if (order) {
      order.status = newStatus;
      MockStore.save();
    }
    this.switchTab("workorders");
  },

  renderDashboard() {
    MockStore.load();
    const myOrders = MockStore.workOrders.filter(
      (o) => o.assignedTo === authStorage.getUserEmail(),
    );
    const stats = {
      assignedToday: myOrders.length,
      assignedTomorrow: 0, // Added to fix undefined display
      completedToday: myOrders.filter((o) => o.status === "Completed").length,
      remainsToday: myOrders.filter(
        (o) => o.status !== "Completed" && o.status !== "Cancelled",
      ).length,
    };

    return `
      <div class="animate-fade-in space-y-8">
        <div>
          <h2 class="text-2xl font-bold text-white">Mechanic Workspace</h2>
          <p class="text-slate-500 text-sm">Personal load and daily schedule</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${this._renderStatCard("Assigned Today", stats.assignedToday, "emerald-500")}
          ${this._renderStatCard("Assigned Tomorrow", stats.assignedTomorrow, "blue-500")}
          ${this._renderStatCard("Completed Today", stats.completedToday, "emerald-400")}
          ${this._renderStatCard("Remains Today", stats.remainsToday, "amber-500")}
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div class="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h3 class="text-sm font-bold uppercase tracking-widest text-slate-400">Today's Orders</h3>
            <span class="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded font-bold uppercase tracking-wider">
              ${stats.remainsToday} Tasks Remaining
            </span>
          </div>
          <div class="divide-y divide-slate-800">
            ${
              myOrders.length > 0
                ? myOrders
                    .map((o) =>
                      this._renderSimpleRow(
                        o.orderId,
                        o.customer,
                        o.vehicle,
                        o.services,
                        o.status,
                        this._getStatusColorKey(o.status),
                      ),
                    )
                    .join("")
                : '<div class="p-6 text-center text-slate-500 text-sm">No orders assigned for today.</div>'
            }
          </div>
        </div>
      </div>`;
  },

  renderWorkOrders() {
    MockStore.load();
    const myOrders = MockStore.workOrders.filter(
      (o) => o.assignedTo === authStorage.getUserEmail(),
    );
    return `
      <div class="animate-fade-in">
        <h2 class="text-2xl font-bold mb-6 text-white">Active Work Orders</h2>
        <div class="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-900 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th class="p-4">Order ID</th>
                <th class="p-4">Customer & Vehicle</th>
                <th class="p-4">Status</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              ${
                myOrders.length > 0
                  ? myOrders
                      .map((o) =>
                        this._renderTableOrderRow(
                          o.orderId,
                          o.customer,
                          o.vehicle,
                          o.status,
                          this._getStatusColorKey(o.status),
                        ),
                      )
                      .join("")
                  : '<tr><td colspan="4" class="p-8 text-center text-slate-500">No work orders found.</td></tr>'
              }
            </tbody>
          </table>
        </div>
      </div>`;
  },

  _getStatusColorKey(status) {
    switch (status) {
      case "In Progress":
        return "blue-400";
      case "Completed":
        return "emerald-500";
      case "Pending":
        return "amber-500";
      case "Cancelled":
        return "red-500";
      default:
        return "slate-500";
    }
  },

  _renderStatCard(label, val, colorKey) {
    const colorClasses = {
      "emerald-500": "text-emerald-500",
      "blue-500": "text-blue-500",
      "emerald-400": "text-emerald-400",
      "amber-500": "text-amber-500",
      "slate-500": "text-slate-500",
      "red-500": "text-red-500",
    };

    return `
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-600 hover:shadow-lg group">
        <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest group-hover:text-slate-400 transition-colors">${label}</p>
        <p class="text-4xl font-black ${colorClasses[colorKey] || "text-white"} mt-1">${val}</p>
      </div>`;
  },

  _badgeClasses(colorKey) {
    const badgeStyles = {
      "blue-400": "text-blue-400 border border-blue-400/20 bg-blue-400/10",
      "slate-500": "text-slate-500 border border-slate-500/20 bg-slate-500/10",
      "emerald-500":
        "text-emerald-500 border border-emerald-500/20 bg-emerald-500/10",
      "amber-500": "text-amber-500 border border-amber-500/20 bg-amber-500/10",
      "cyan-500": "text-cyan-500 border border-cyan-500/20 bg-cyan-500/10",
      "red-500": "text-red-500 border border-red-500/20 bg-red-500/10",
    };
    return (
      badgeStyles[colorKey] ||
      "text-slate-400 border border-slate-700/20 bg-slate-800/20"
    );
  },

  _renderSimpleRow(id, name, car, task, status, colorKey) {
    const badge = this._badgeClasses(colorKey);
    return `
      <div class="px-6 py-5 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
        <div class="flex items-center gap-6">
          <div class="h-10 w-10 rounded-lg bg-black border border-slate-800 flex items-center justify-center text-[10px] font-mono font-bold text-slate-500">${id}</div>
          <div>
            <p class="text-sm font-bold text-white">${name}</p>
            <p class="text-xs text-slate-400">${car} | ${task}</p>
          </div>
        </div>
        <span class="text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest whitespace-nowrap ${badge}">${status}</span>
      </div>`;
  },

  _renderTableOrderRow(id, customer, vehicle, status, colorKey) {
    const badge = this._badgeClasses(colorKey);
    return `
      <tr class="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
        <td class="p-4 font-mono text-emerald-500 font-bold">${id}</td>
        <td class="p-4 text-white">
          <div class="font-bold text-sm">${customer}</div>
          <div class="text-[11px] text-slate-500">${vehicle}</div>
        </td>
        <td class="p-4">
          <span class="text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest whitespace-nowrap ${badge}">${status}</span>
        </td>
        <td class="p-4 text-right">
          <select onchange="app.updateOrderStatus('${id}', this.value)" class="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1 outline-none cursor-pointer focus:border-emerald-500 transition-colors">
            <option value="Pending" ${status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="In Progress" ${status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option value="Completed" ${status === "Completed" ? "selected" : ""}>Completed</option>
            <option value="Cancelled" ${status === "Cancelled" ? "selected" : ""}>Cancelled</option>
          </select>
        </td>
      </tr>`;
  },

  logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    window.location.href = "/src/pages/login.html";
  },
};

// Global exports
window.app = app;
window.switchTab = (id) => app.switchTab(id);
window.logout = () => app.logout();

document.addEventListener("DOMContentLoaded", () => app.init());
window.switchTab = (id) => app.switchTab(id);
window.logout = () => app.logout();

document.addEventListener("DOMContentLoaded", () => app.init());
