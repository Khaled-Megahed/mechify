const app = {
  init() {
    // SECURITY CHECK: Redirect to login if not authenticated
    if (localStorage.getItem("isLoggedIn") !== "true") {
      window.location.href = "/src/pages/login.html";
      return;
    }

    this.initHeader();
    // Default to dashboard
    this.switchTab("dashboard");
  },

  initHeader() {
    // Get data from localStorage with fallbacks
    const email = localStorage.getItem("userEmail") || "mechanic@mechify.com";
    const role = localStorage.getItem("userRole") || "Lead Mechanic";

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
      if (tabId === "dashboard") {
        container.innerHTML = this.renderDashboard();
      } else if (tabId === "workorders") {
        container.innerHTML = this.renderWorkOrders();
      }
    }, 200);
  },

  updateOrderStatus(orderId, newStatus) {
    console.log(`Order ${orderId} changed to ${newStatus}`);
    alert(`Status Updated: Order ${orderId} is now ${newStatus}`);
    // Optional: Refresh the view to show updated data
    this.switchTab("workorders");
  },

  renderDashboard() {
    const stats = {
      assignedToday: 5,
      assignedTomorrow: 3,
      completedToday: 3,
      remainsToday: 2,
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
            ${this._renderSimpleRow("#8821", "John Doe", "Tesla Model 3", "Brake Pads", "In Progress", "blue-400")}
            ${this._renderSimpleRow("#8825", "Sarah Jenkins", "Toyota Camry", "Oil Service", "Pending", "slate-500")}
            ${this._renderSimpleRow("#8819", "Mike Ross", "Ford F-150", "Diagnostics", "Completed", "emerald-500")}
          </div>
        </div>
      </div>`;
  },

  renderWorkOrders() {
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
              ${this._renderTableOrderRow("#8821", "John Doe", "Tesla Model 3", "In Progress", "blue-400")}
              ${this._renderTableOrderRow("#8825", "Sarah Jenkins", "Toyota Camry", "Pending", "slate-500")}
            </tbody>
          </table>
        </div>
      </div>`;
  },

  _renderStatCard(label, val, color) {
    return `
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-600 hover:shadow-lg group">
        <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest group-hover:text-slate-400 transition-colors">${label}</p>
        <p class="text-4xl font-black text-${color} mt-1">${val}</p>
      </div>`;
  },

  _renderSimpleRow(id, name, car, task, status, color) {
    return `
      <div class="px-6 py-5 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
        <div class="flex items-center gap-6">
          <div class="h-10 w-10 rounded-lg bg-black border border-slate-800 flex items-center justify-center text-[10px] font-mono font-bold text-slate-500">${id}</div>
          <div>
            <p class="text-sm font-bold text-white">${name}</p>
            <p class="text-xs text-slate-400">${car} | ${task}</p>
          </div>
        </div>
        <span class="text-[10px] font-black px-3 py-1.5 rounded-lg bg-${color}/10 text-${color} border border-${color}/20 uppercase tracking-widest whitespace-nowrap">${status}</span>
      </div>`;
  },

  _renderTableOrderRow(id, customer, vehicle, status, color) {
    return `
      <tr class="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
        <td class="p-4 font-mono text-emerald-500 font-bold">${id}</td>
        <td class="p-4 text-white">
          <div class="font-bold text-sm">${customer}</div>
          <div class="text-[11px] text-slate-500">${vehicle}</div>
        </td>
        <td class="p-4">
          <span class="text-[10px] font-black px-3 py-1.5 rounded-lg bg-${color}/10 text-${color} border border-${color}/20 uppercase tracking-widest whitespace-nowrap">${status}</span>
        </td>
        <td class="p-4 text-right">
          <select onchange="app.updateOrderStatus('${id}', this.value)" class="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1 outline-none cursor-pointer focus:border-emerald-500 transition-colors">
            <option value="" disabled selected>Update</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </td>
      </tr>`;
  },

  logout() {
    localStorage.clear();
    window.location.href = "/src/pages/login.html";
  },
};

// Global exports
window.app = app;
window.switchTab = (id) => app.switchTab(id);
window.logout = () => app.logout();

document.addEventListener("DOMContentLoaded", () => app.init());
