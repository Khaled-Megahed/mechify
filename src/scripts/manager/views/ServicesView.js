/**
 * ServicesView.js
 * Encapsulates the Service Catalog UI and internal logic
 */
export class ServicesView {
  /**
   * Returns the main HTML structure for the Services tab
   */
  static render() {
    return `
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 animate-fade-in">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Service Catalog</h2>
          <p class="text-slate-500 text-sm font-medium italic">Standardize labor rates and service durations</p>
        </div>
        
        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="relative flex-1 md:w-72 group">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 group-focus-within:text-emerald-500 transition-colors">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <input type="text" placeholder="Filter services..." oninput="window.handleServiceSearch(this.value)"
              class="w-full bg-slate-900/40 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none">
          </div>
          <button onclick="window.openAddServiceModal()" 
            class="bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2 cursor-pointer active:scale-95">
            <span>+</span> <span>New Service</span>
          </button>
        </div>
      </div>

      <div id="services-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        <div class="stat-card group hover:border-emerald-500/40 transition-all duration-300">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-white font-bold text-lg tracking-tight group-hover:text-emerald-400 transition-colors">Brake Pad Replacement</h3>
              <div class="flex items-center gap-2 mt-1">
                <svg class="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/></svg>
                <span class="text-slate-500 text-[10px] uppercase font-black tracking-widest">1.5 Standard Hours</span>
              </div>
            </div>
            <button onclick="this.closest('.stat-card').remove()" class="text-slate-700 hover:text-red-500 transition-colors cursor-pointer p-1.5 bg-slate-800/50 rounded-lg">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-6">
            <div class="bg-slate-950/50 p-3 rounded-2xl border border-slate-800 group-hover:border-slate-700 transition-colors">
              <p class="text-[9px] font-black text-slate-500 uppercase tracking-tighter mb-1">Labor Cost</p>
              <p class="text-sm font-bold text-slate-200">$120.00</p>
            </div>
            <div class="bg-emerald-500/5 p-3 rounded-2xl border border-emerald-500/20 group-hover:bg-emerald-500/10 transition-all">
              <p class="text-[9px] font-black text-emerald-500 uppercase tracking-tighter mb-1">Total Quote</p>
              <p class="text-sm font-black text-emerald-400">$205.99</p>
            </div>
          </div>

          <div class="pt-5 border-t border-slate-800/80">
            <p class="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Inventory Breakdown</p>
            <div class="space-y-2">
              <div class="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800/50">
                <span class="text-[11px] font-medium text-slate-400">Ceramic Front Pads</span>
                <span class="text-[11px] font-mono text-slate-500 font-bold">$85.99</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static openAddServiceModal() {
    const modalHtml = `
      <div id="service-modal-overlay" class="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-100 flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-scale-up">
          <div class="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div>
              <h3 class="text-xl font-bold text-white tracking-tight">Define Service</h3>
              <p class="text-slate-500 text-xs">Establish catalog rates for work orders</p>
            </div>
            <button onclick="window.closeServiceModal()" class="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-500 hover:text-white transition-all text-2xl cursor-pointer">&times;</button>
          </div>
          
          <form id="add-service-form" class="p-8 space-y-6" onsubmit="window.saveService(event)">
            <div>
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Service Description</label>
              <input type="text" id="srv-name" required placeholder="e.g. Full Synthetic Oil Change" class="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all">
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Est. Hours</label>
                <div class="relative">
                  <input type="number" step="0.1" id="srv-time" required placeholder="1.0" class="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:border-emerald-500 outline-none transition-all">
                  <span class="absolute right-4 top-3 text-[10px] font-black text-slate-700 uppercase">HRS</span>
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Labor Flat Rate</label>
                <div class="relative">
                  <span class="absolute left-4 top-3 text-slate-600 text-sm">$</span>
                  <input type="number" step="0.01" id="srv-labor" required placeholder="0.00" class="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-8 pr-4 text-sm text-white focus:border-emerald-500 outline-none transition-all">
                </div>
              </div>
            </div>

            <div class="pt-6 border-t border-slate-800">
              <div class="flex justify-between items-center mb-4">
                <h4 class="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Required Parts</h4>
              </div>
              <textarea id="srv-parts" placeholder="Oil Filter ($15.00), 5W30 Synthetic ($45.00)" 
                class="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white h-28 outline-none focus:border-blue-500 transition-all placeholder:text-slate-700"></textarea>
              <p class="text-[9px] text-slate-600 mt-2 italic font-medium">Format: Part Name ($Price), Part Name ($Price)</p>
            </div>

            <div class="pt-8 flex gap-4">
              <button type="button" onclick="window.closeServiceModal()" class="flex-1 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-800 hover:text-white transition-all cursor-pointer">Discard</button>
              <button type="submit" class="flex-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-900/30 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]">Save Service</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }

  static closeServiceModal() {
    const modal = document.getElementById("service-modal-overlay");
    if (modal) modal.remove();
  }

  static saveService(event) {
    event.preventDefault();
    const name = document.getElementById("srv-name").value;
    const time = document.getElementById("srv-time").value;
    const labor = parseFloat(document.getElementById("srv-labor").value);
    const partsRaw = document.getElementById("srv-parts").value;

    let partsTotal = 0;
    let partsHtml = "";

    if (partsRaw) {
      partsRaw.split(",").forEach((p) => {
        const priceMatch = p.match(/\$(\d+\.?\d*)/);
        const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
        const partName = p.replace(/\(\$.*?\)/, "").trim();
        if (partName) {
          partsTotal += price;
          partsHtml += `
            <div class="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800/50">
              <span class="text-[11px] font-medium text-slate-400">${partName}</span>
              <span class="text-[11px] font-mono text-slate-500 font-bold">$${price.toFixed(2)}</span>
            </div>`;
        }
      });
    }

    const total = labor + partsTotal;

    const newCard = `
      <div class="stat-card group animate-scale-up hover:border-emerald-500/40 transition-all duration-300">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-white font-bold text-lg tracking-tight group-hover:text-emerald-400 transition-colors">${name}</h3>
            <div class="flex items-center gap-2 mt-1">
              <svg class="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/></svg>
              <span class="text-slate-500 text-[10px] uppercase font-black tracking-widest">${time} Standard Hours</span>
            </div>
          </div>
          <button onclick="this.closest('.stat-card').remove()" class="text-slate-700 hover:text-red-500 transition-colors cursor-pointer p-1.5 bg-slate-800/50 rounded-lg">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
        <div class="grid grid-cols-2 gap-3 mb-6">
          <div class="bg-slate-950/50 p-3 rounded-2xl border border-slate-800 group-hover:border-slate-700 transition-colors">
            <p class="text-[9px] font-black text-slate-500 uppercase tracking-tighter mb-1">Labor Cost</p>
            <p class="text-sm font-bold text-slate-200">$${labor.toFixed(2)}</p>
          </div>
          <div class="bg-emerald-500/5 p-3 rounded-2xl border border-emerald-500/20 group-hover:bg-emerald-500/10 transition-all">
            <p class="text-[9px] font-black text-emerald-500 uppercase tracking-tighter mb-1">Total Quote</p>
            <p class="text-sm font-black text-emerald-400">$${total.toFixed(2)}</p>
          </div>
        </div>
        <div class="pt-5 border-t border-slate-800/80">
          <p class="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Inventory Breakdown</p>
          <div class="space-y-2">${partsHtml || '<p class="text-[10px] text-slate-600 italic">No parts required</p>'}</div>
        </div>
      </div>`;

    const grid = document.getElementById("services-grid");
    if (grid) grid.insertAdjacentHTML("afterbegin", newCard);
    this.closeServiceModal();
  }

  static handleServiceSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    const cards = document.querySelectorAll("#services-grid .stat-card");
    cards.forEach((card) => {
      const serviceName = card.querySelector("h3").innerText.toLowerCase();
      card.style.display = serviceName.includes(searchTerm) ? "block" : "none";
    });
  }
}
