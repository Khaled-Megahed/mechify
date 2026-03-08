/**
 * DashboardView.js
 * Encapsulates the Executive Summary and metrics UI with dynamic data binding.
 */
import { Model } from "../model.js";

export class DashboardView {
  /**
   * Returns the main HTML structure for the Dashboard tab
   */
  static render() {
    // 1. DATA CALCULATION ENGINE
    const orders = Model.workOrders || [];
    const totalCount = orders.length;
    const pendingCount = orders.filter((o) => o.status === "Pending").length;
    const activeCount = orders.filter((o) => o.status === "In Progress").length;
    const completedCount = orders.filter(
      (o) => o.status === "Completed",
    ).length;

    const revenue = completedCount * 150;
    const completionRate =
      totalCount > 0
        ? ((completedCount / totalCount) * 100).toFixed(1)
        : "0.00";

    return `
      <div class="flex justify-between items-end mb-8 animate-fade-in">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Executive Summary</h2>
          <p class="text-slate-500 text-sm font-medium">Reporting Period: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 text-[10px] font-black text-emerald-500 tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live 
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        ${this.renderStatCard("Total Orders", totalCount, "blue")}
        ${this.renderStatCard("Scheduled", pendingCount, "amber")}
        ${this.renderStatCard("In Progress", activeCount, "cyan")}
        ${this.renderStatCard("Completed", completedCount, "emerald")}
        ${this.renderStatCard("Cancelled", 0, "red")}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" style="animation-delay: 100ms">
        <div class="space-y-4">
          <h4 class="text-xs font-bold text-slate-600 uppercase tracking-widest px-1">Financial Health</h4>
          <div class="metric-box group"><span>Total Revenue</span><span class="text-white group-hover:text-emerald-400 transition-colors">$${revenue.toFixed(2)}</span></div>
          <div class="metric-box group"><span>Net Profit</span><span class="text-emerald-400 group-hover:glow-emerald">$0.00</span></div>
          <div class="metric-box group"><span>Profit Margin</span><span class="text-slate-500 group-hover:text-slate-300">0.00%</span></div>
        </div>

        <div class="space-y-4">
          <h4 class="text-xs font-bold text-slate-600 uppercase tracking-widest px-1">Efficiency</h4>
          <div class="metric-box group"><span>Completion Rate</span><span class="group-hover:text-cyan-400 transition-colors">${completionRate}%</span></div>
          <div class="metric-box group"><span>Avg. Revenue / Order</span><span class="group-hover:text-white">$0.00</span></div>
          <div class="metric-box group"><span>Orders Per Vehicle</span><span class="group-hover:text-white">1.00</span></div>
        </div>

        <div class="space-y-4">
          <h4 class="text-xs font-bold text-slate-600 uppercase tracking-widest px-1">Customer Traffic</h4>
          <div class="metric-box group"><span>Unique Vehicles</span><span class="group-hover:text-white">${totalCount}</span></div>
          <div class="metric-box group"><span>Unique Customers</span><span class="group-hover:text-white">${Model.customers.length}</span></div>
          <div class="metric-box group"><span>Cancellation Rate</span><span class="group-hover:text-red-400">0.00%</span></div>
        </div>
      </div>

      <style>
        .stat-card {
          @apply transition-all duration-300 cursor-default bg-slate-900/40 p-5 rounded-lg border-t-2;
        }
        .stat-card:hover {
          @apply bg-slate-800/80 -translate-y-1 shadow-2xl;
          border-top-width: 4px;
        }
        .metric-box {
          @apply flex justify-between items-center bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl text-xs font-medium text-slate-400 transition-all;
        }
        .metric-box:hover {
          @apply border-slate-600 bg-slate-800/40;
        }
        .glow-emerald { text-shadow: 0 0 8px rgba(16, 185, 129, 0.6); }
      </style>
    `;
  }

  static renderStatCard(label, val, color) {
    const theme = {
      blue: "border-blue-500 text-blue-400",
      amber: "border-amber-500 text-amber-500",
      cyan: "border-cyan-400 text-cyan-400",
      emerald: "border-emerald-500 text-emerald-500",
      red: "border-red-500 text-red-500",
    };

    return `
      <div class="stat-card ${theme[color]} group">
        <span class="text-[10px] font-black uppercase tracking-tighter">${label}</span>
        <h3 class="text-4xl font-bold text-white mt-2 transition-transform group-hover:scale-105 origin-left">${val}</h3>
      </div>
    `;
  }
}
