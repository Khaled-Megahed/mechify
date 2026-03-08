/**
 * WorkOrderView.js
 * Manages the UI for active repair jobs and shop workflow
 */
import { Model } from "../model.js";

export class WorkOrderView {
  /**
   * Renders the main container for the Work Orders Tab
   */
  static render(filter = "All") {
    const activeDate =
      Model.currentActiveDate || new Date().toISOString().split("T")[0];

    // 1. Get unique Order IDs from the schedule for the selected day
    const dayBookings = Model.scheduleData[activeDate] || {};
    const bookingOrderIds = [
      ...new Set(
        Object.values(dayBookings)
          .flat()
          .map((b) => b.orderId),
      ),
    ];

    // 2. Filter master workOrders to only show what is on the schedule for today
    let orders = (Model.workOrders || []).filter((order) =>
      bookingOrderIds.includes(order.orderId),
    );

    // 3. Apply Status Filter
    if (filter !== "All") {
      orders = orders.filter((o) => o.status === filter);
    }

    return `
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-fade-in">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Shop Floor Summary</h2>
          <div class="flex items-center gap-2 mt-1">
             <input type="date" 
               value="${activeDate}" 
               onchange="window.changeWorkOrderDate(this.value)"
               class="bg-slate-900 border border-slate-800 text-emerald-500 text-xs font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer">
             <p class="text-slate-500 text-sm font-medium">Monitoring schedule for this date</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button onclick="window.renderFilteredWorkOrders('All')" 
              class="px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === "All" ? "text-emerald-400 bg-slate-800 shadow-md" : "text-slate-500 hover:text-slate-300"}">
              All
            </button>
            <button onclick="window.renderFilteredWorkOrders('In Progress')" 
              class="px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === "In Progress" ? "text-emerald-400 bg-slate-800 shadow-md" : "text-slate-500 hover:text-slate-300"}">
              In Progress
            </button>
          </div>
        </div>
      </div>

      <div class="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 mb-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 border-b border-slate-800/50">
        <div class="col-span-1">ID</div>
        <div class="col-span-6">Customer & Services</div>
        <div class="col-span-3">Technician</div>
        <div class="col-span-2 text-right">Status</div>
      </div>

      <div id="work-order-list" class="space-y-3 animate-fade-in">
        ${orders.length > 0 ? this.renderOrders(orders) : this.renderEmptyState(activeDate)}
      </div>
    `;
  }

  /**
   * Generates Summary Rows for the list
   */
  static renderOrders(orders) {
    return orders
      .map((order) => {
        const status = order.status || "Pending";

        return `
          <div class="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 lg:p-3 hover:bg-slate-800/30 transition-all group hover:border-emerald-500/30">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              
              <div class="col-span-1">
                <span class="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter">
                  ${order.orderId}
                </span>
              </div>

              <div class="col-span-6">
                <h3 class="text-white text-sm font-bold truncate group-hover:text-emerald-400 transition-colors">${order.customer}</h3>
                <p class="text-slate-500 text-[10px] font-medium truncate uppercase tracking-wider">${order.services || "General Maintenance"}</p>
              </div>

              <div class="col-span-3 flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-bold text-white border border-slate-700">
                  ${(order.techName || "U")[0]}
                </div>
                <span class="text-xs text-slate-300 font-semibold">${order.techName || "Unassigned"}</span>
              </div>

              <div class="col-span-2 text-right">
                <span class="inline-block text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md bg-slate-950 border ${this.getStatusColor(status)}">
                  ${status}
                </span>
              </div>

            </div>
          </div>
        `;
      })
      .join("");
  }

  static getStatusColor(status) {
    switch (status) {
      case "In Progress":
        return "text-blue-400 border-blue-500/30 bg-blue-500/5";
      case "Pending":
        return "text-amber-400 border-amber-500/30 bg-amber-500/5";
      case "Completed":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-500/5";
      default:
        return "text-slate-400 border-slate-800";
    }
  }

  static renderEmptyState(date) {
    return `
      <div class="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
        <svg class="w-8 h-8 text-slate-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">No orders found for ${date}</p>
      </div>
    `;
  }
}
