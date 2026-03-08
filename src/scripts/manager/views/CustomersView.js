/**
 * CustomersView.js
 * Encapsulates the UI template and internal logic for the Customer Directory
 */
export class CustomersView {
  /**
   * Returns the main HTML structure for the Customers tab
   */
  static render() {
    return `
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 animate-fade-in">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Customer Directory</h2>
          <p class="text-slate-500 text-sm font-medium italic">Manage client profiles and registered vehicles</p>
        </div>
        
        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="relative flex-1 md:w-72 group">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 group-focus-within:text-emerald-500 transition-colors">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <input type="text" placeholder="Search name, plate, or email..." oninput="window.handleSearch(this.value)"
               class="w-full bg-slate-900/40 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none">
          </div>
          <button onclick="window.openAddCustomerModal()" 
           class="bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2 cursor-pointer active:scale-95">
            <span class="text-lg group-hover:rotate-90 transition-transform leading-none">+</span> <span>New Customer</span>
          </button>
        </div>
      </div>

      <div id="customer-grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
        <div class="stat-card group hover:border-emerald-500/50 transition-all duration-300">
          <div class="flex justify-between items-start mb-5">
            <div class="flex items-center gap-4">
              <div class="h-14 w-14 rounded-2xl bg-emerald-500 text-slate-900 flex items-center justify-center font-black text-xl shadow-lg">SJ</div>
              <div>
                <h3 class="text-white font-bold text-lg tracking-tight group-hover:text-emerald-400 transition-colors">Sarah Jenkins</h3>
                <p class="text-slate-500 text-[10px] font-black uppercase tracking-tighter">Active Customer</p>
              </div>
            </div>
            <button onclick="window.deleteCustomer(this)" class="text-slate-700 hover:text-red-500 hover:cursor-pointer transition-colors p-2 bg-slate-800/50 rounded-lg">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <div class="space-y-2 mb-6 px-1">
            <div class="flex items-center gap-2 text-slate-300 text-sm italic">
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="2"/></svg>
              sarah.j@outlook.com
            </div>
            <div class="flex items-center gap-2 text-slate-300 text-sm">
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke-width="2"/></svg>
              +1 (555) 012-3456
            </div>
          </div>

          <div class="pt-5 border-t border-slate-800/80">
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Vehicles</p>
            <div class="space-y-2">
              <div class="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800 group/item hover:border-blue-500/30 transition-all">
                <span class="text-[11px] font-black text-blue-400 uppercase tracking-tight">Toyota Corolla</span>
                <span class="px-3 py-1 rounded bg-slate-900 text-[11px] font-mono text-emerald-500 border border-emerald-500/20">ADC123: 8892-A</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* Rest of methods (openAddCustomerModal, saveCustomer, etc.) remain as previously defined */
}
