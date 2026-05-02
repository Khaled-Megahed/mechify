/**
 * ScheduleView.js
 * Encapsulates the Shop Schedule grid and the Scheduling Modal UI & Logic
 */
import { Model } from "../model.js";

// Module-level state management
let pendingScheduleData = null;
let currentEditingOrderId = null;

class ScheduleView {
  /**
   * Main Render for the Schedule Container Structure
   */
  render() {
    const bayLetters = ["A", "B", "C", "D"];

    return `
      <div class="flex flex-col h-[calc(100vh-140px)] animate-fade-in">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h2 class="text-xl font-bold text-white tracking-tight">Shop Schedule</h2>
            <p class="text-slate-500 text-xs font-medium">Manage bays and time slots</p>
          </div>
          <div class="flex items-center gap-3">
            <input type="date" id="schedule-date-picker" value="${Model.currentActiveDate}" 
              onchange="window.changeScheduleDate(this.value)"
              class="bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-3 text-xs text-white focus:ring-2 focus:ring-emerald-500/50 outline-none cursor-pointer">
          </div>
        </div>

        <div class="flex-1 min-h-0 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
          <div class="grid grid-cols-[80px_1fr_1fr_1fr_1fr] bg-slate-950 border-b border-slate-800 sticky top-0 z-30">
            <div class="p-2 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Time</div>
            ${Model.mechanicsList
              .map(
                (m, index) => `
                <div class="p-2 text-[11px] font-black text-emerald-500 uppercase tracking-widest text-center border-l border-slate-800">
                   Bay ${bayLetters[index] || index + 1}
                </div>
              `,
              )
              .join("")}
          </div>

          <div id="schedule-grid-body" class="flex-1 overflow-y-auto overflow-x-hidden bg-slate-900/20 custom-scrollbar"></div>
        </div>
      </div>
    `;
  }

  /**
   * Renders the dynamic grid content
   */
  renderScheduleGrid() {
    const container = document.getElementById("schedule-grid-body");
    if (!container) return;

    if (!Model.scheduleData[Model.currentActiveDate]) {
      Model.scheduleData[Model.currentActiveDate] = {
        mech1: [],
        mech2: [],
        mech3: [],
        mech4: [],
      };
    }

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const isToday = Model.currentActiveDate === todayStr;
    const slotHeight = 42;

    // Define explicit rows for every time label to ensure spanning is pixel-perfect
    const gridRows = `grid-template-rows: repeat(${Model.timeLabels.length}, ${slotHeight}px);`;

    let html = `<div class="grid grid-cols-[80px_1fr_1fr_1fr_1fr] relative" style="${gridRows}">`;

    if (isToday) {
      const startHour = 8;
      const minutesSinceStart =
        (now.getHours() - startHour) * 60 + now.getMinutes();
      if (minutesSinceStart >= 0 && minutesSinceStart <= 600) {
        const topOffset = (minutesSinceStart / 30) * slotHeight;
        html += `<div id="time-now-line" class="absolute left-0 right-0 z-20 pointer-events-none flex items-center" style="top: ${topOffset}px">
                   <div class="w-full h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                 </div>`;
      }
    }

    for (let i = 0; i < Model.timeLabels.length; i++) {
      // Time column is always grid-column 1
      html += `<div class="border-b border-slate-800/40 flex items-center justify-center bg-slate-950/30 text-[10px] font-mono text-slate-500" style="grid-column: 1; grid-row: ${i + 1};">${Model.timeLabels[i]}</div>`;

      let colIdx = 2;
      for (let m of Model.mechanicsList) {
        const status = Model.isSlotBooked(Model.currentActiveDate, m.id, i);

        if (status.booked && status.isStart) {
          const isPast = this.checkIfPast(i, todayStr, isToday, now);
          const actionButtons = this.getActionButtons(
            m.id,
            i,
            status.orderId,
            isPast,
          );

          html += `
            <div class="p-1 border-l border-b border-slate-800/30" style="grid-column: ${colIdx}; grid-row: ${i + 1} / span ${status.duration}; z-index: 10;">
              <div class="h-full w-full bg-emerald-500/15 border border-emerald-500/40 rounded-xl p-2 flex flex-col relative group overflow-hidden shadow-xl">
                ${actionButtons}
                <span class="text-[10px] font-black text-emerald-300 truncate w-[80%] uppercase">${status.customer}</span>
                <span class="text-[8px] text-slate-400 italic truncate mb-2">${status.vehicle || ""}</span>
                <div class="flex flex-col gap-1">
                  ${(status.services || "General Service")
                    .split(", ")
                    .map(
                      (s) => `
                    <div class="text-[9px] text-slate-100 font-bold truncate flex items-center gap-1.5">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>${s}
                    </div>`,
                    )
                    .join("")}
                </div>
              </div>
            </div>`;
        } else if (!status.booked) {
          const isPast = this.checkIfPast(i, todayStr, isToday, now);
          html += isPast
            ? `<div class="p-0.5 border-l border-b border-slate-800/20 bg-slate-950/20 flex items-center justify-center opacity-10" style="grid-column: ${colIdx}; grid-row: ${i + 1};"><svg class="w-3 h-3 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>`
            : `<div class="p-0.5 border-l border-b border-slate-800/20" style="grid-column: ${colIdx}; grid-row: ${i + 1};"><button onclick="window.openScheduleModal('${m.id}', ${i})" class="h-full w-full rounded-lg hover:bg-emerald-500/5 flex items-center justify-center group cursor-pointer"><span class="text-slate-800 group-hover:text-emerald-500/40 text-lg font-bold transition-colors">+</span></button></div>`;
        }
        colIdx++;
      }
    }
    container.innerHTML = html + `</div>`;
  }

  changeScheduleDate(newDate) {
    Model.currentActiveDate = newDate;
    this.renderScheduleGrid();
  }

  scrollScheduleToTime() {
    const line = document.getElementById("time-now-line");
    const gridBody = document.getElementById("schedule-grid-body");
    if (line && gridBody) {
      gridBody.scrollTo({ top: line.offsetTop - 100, behavior: "smooth" });
    }
  }

  checkIfPast(slotIdx, todayStr, isToday, now) {
    const [timePart, modifier] = Model.timeLabels[slotIdx].split(" ");
    let [hrs, mins] = timePart.split(":").map(Number);
    if (modifier === "PM" && hrs !== 12) hrs += 12;
    if (modifier === "AM" && hrs === 12) hrs = 0;
    const slotDate = new Date();
    slotDate.setHours(hrs, mins, 0, 0);
    return Model.currentActiveDate < todayStr || (isToday && slotDate < now);
  }

  getActionButtons(mechId, startIdx, orderId, isPast) {
    if (isPast) {
      return `
        <div class="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-30">
          <button onclick="window.viewOrderDetails('${orderId}')" class="text-blue-400 hover:text-blue-300 bg-slate-950/90 rounded-full p-1 border border-blue-500/30 shadow-lg">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
        </div>`;
    }
    return `
      <div class="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-30">
        <button onclick="window.editScheduleItem('${mechId}', ${startIdx}, '${orderId}')" class="text-amber-400 hover:text-amber-300 bg-slate-950/90 rounded-full p-1 border border-amber-500/30 shadow-lg">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
        </button>
        <button onclick="window.removeScheduleItem('${mechId}', ${startIdx})" class="text-red-400 hover:text-red-300 bg-slate-950/90 rounded-full p-1 border border-red-500/30 shadow-lg">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>`;
  }

  openScheduleModal(mechId, startIdx, booking = null) {
    pendingScheduleData = { date: Model.currentActiveDate, mechId, startIdx };
    currentEditingOrderId = booking?.orderId || null;

    const timeOptions = Model.timeLabels
      .map(
        (l, i) =>
          `<option value="${i}" ${i === startIdx ? "selected" : ""}>${l}</option>`,
      )
      .join("");
    const mechanicOptions = Model.mechanicsList
      .map(
        (m, idx) =>
          `<option value="${m.id}" ${m.id === mechId ? "selected" : ""}>Bay ${["A", "B", "C", "D"][idx] || idx + 1} (${m.name})</option>`,
      )
      .join("");
    const servicesHtml = Model.mockServices
      .map(
        (s) => `
      <label class="flex items-center gap-2 p-2 rounded-lg border border-slate-800 bg-slate-950 hover:border-emerald-500/50 cursor-pointer transition-colors group">
        <input type="checkbox" value="${s.id}" data-time="${s.time}" data-cost="${s.baseCost ?? 0}" data-name="${s.name}" onchange="window.updateCalculatedTime()" class="srv-checkbox w-3.5 h-3.5 accent-emerald-500 bg-slate-900 border-slate-700 rounded">
        <div class="flex-1 flex justify-between items-center">
          <span class="text-xs font-medium text-slate-200">${s.name}</span>
          <span class="text-[9px] font-mono text-slate-500">${s.time} hrs</span>
        </div>
      </label>`,
      )
      .join("");

    const modalHtml = `
      <div id="schedule-modal-overlay" class="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
        <div class="bg-slate-900 border border-slate-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-scale-up">
          <div class="px-5 py-3 border-b border-slate-800 flex justify-between items-center">
            <h3 class="text-white text-sm font-bold">Schedule Order — ${Model.timeLabels[startIdx]}</h3>
            <button onclick="window.closeScheduleModal()" class="text-slate-500 hover:text-white text-xl">&times;</button>
          </div>
          <form id="schedule-form" class="p-5 space-y-4" onsubmit="window.saveScheduleItem(event)">
            <div class="grid grid-cols-2 gap-3">
               <div class="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <p class="text-[8px] font-black text-slate-500 uppercase mb-1">Bay / Tech</p>
                <select id="sch-mech-id" required class="w-full bg-transparent text-xs font-bold text-emerald-400 outline-none">${mechanicOptions}</select>
              </div>
              <div class="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <p class="text-[8px] font-black text-slate-500 uppercase mb-1">Start Time</p>
                <select id="sch-start-time" class="w-full bg-transparent text-xs font-bold text-blue-400 outline-none">${timeOptions}</select>
              </div>
            </div>
            <div>
              <label class="block text-[9px] font-black text-slate-500 uppercase mb-1">Customer Name</label>
              <input list="customer-list" id="sch-cust-input" autocomplete="off" oninput="window.handleCustomerSelection(this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white outline-none">
              <datalist id="customer-list">${Model.customers.map((c) => `<option value="${c.name}"></option>`).join("")}</datalist>
              <input type="hidden" id="sch-cust-id">
            </div>
            <div>
              <label class="block text-[9px] font-black text-slate-500 uppercase mb-1">Select Vehicle</label>
              <select id="sch-vehicle-id" required disabled class="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white disabled:opacity-50">
                <option value="" disabled selected>Select customer first...</option>
              </select>
            </div>
            <div class="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">${servicesHtml}</div>
            <div class="bg-blue-500/5 border border-blue-500/10 p-3 rounded-lg flex justify-between items-center">
              <span class="text-[9px] font-bold text-blue-400 uppercase">Duration</span>
              <div class="text-right"><span id="calc-time-display" class="text-lg font-black text-white">0.0</span><span class="text-[10px] text-slate-400"> hrs</span></div>
            </div>
            <div class="pt-2 flex gap-2">
              <button type="button" onclick="window.closeScheduleModal()" class="flex-1 px-3 py-2.5 rounded-lg text-[10px] font-black uppercase text-slate-500 hover:bg-slate-800">Cancel</button>
              <button type="submit" id="sch-submit-btn" disabled class="flex-1 bg-emerald-600 text-white px-3 py-2.5 rounded-lg text-[10px] font-black uppercase disabled:bg-slate-800">Confirm Booking</button>
            </div>
          </form>
        </div>
      </div>`;
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    if (booking) {
      document.getElementById("sch-cust-input").value = booking.customer || "";
      document.getElementById("sch-cust-id").value = booking.customerId || "";
      document.getElementById("sch-mech-id").value =
        booking.mechanicId || mechId;
      document.getElementById("sch-start-time").value = booking.startIdx;
      this.handleCustomerSelection(booking.customer || "");
      document.getElementById("sch-vehicle-id").value =
        booking.vehicleId || booking.vehicle || "";
      const selectedServiceIds = (booking.selectedServices || []).map((s) =>
        s.id.toString(),
      );
      document.querySelectorAll(".srv-checkbox").forEach((checkbox) => {
        checkbox.checked = selectedServiceIds.includes(checkbox.value);
      });
      const totalHours = (booking.selectedServices || []).reduce(
        (sum, s) => sum + (parseFloat(s.time) || 0),
        0,
      );
      document.getElementById("calc-time-display").textContent =
        totalHours.toFixed(1);
      document.getElementById("sch-submit-btn").disabled = totalHours === 0;
    }
  }

  editScheduleItem(mechId, startIdx, orderId) {
    const booking = Model.scheduleData[Model.currentActiveDate]?.[mechId]?.find(
      (item) => item.orderId === orderId && item.startIdx === startIdx,
    );

    if (!booking) {
      alert("Selected booking could not be loaded for editing.");
      return;
    }

    pendingScheduleData = { date: Model.currentActiveDate, mechId, startIdx };
    currentEditingOrderId = orderId;
    this.openScheduleModal(mechId, startIdx, booking);
  }

  viewOrderDetails(orderId) {
    const allBookings = Object.values(
      Model.scheduleData[Model.currentActiveDate] || {},
    ).flat();
    const booking = allBookings.find((item) => item.orderId === orderId);
    if (!booking) {
      alert("Order details unavailable.");
      return;
    }
    alert(
      `Order ${booking.orderId}\nCustomer: ${booking.customer}\nVehicle: ${booking.vehicle}\nServices: ${booking.services}\nDuration: ${booking.duration} slots`,
    );
  }

  handleCustomerSelection(val) {
    const hiddenIdInput = document.getElementById("sch-cust-id");
    const vehicleSelect = document.getElementById("sch-vehicle-id");
    const customer = Model.customers.find((c) => c.name === val);

    if (customer) {
      hiddenIdInput.value = customer.id;
      this.updateVehicleList(customer.id);
    } else {
      hiddenIdInput.value = "";
      if (vehicleSelect) {
        vehicleSelect.innerHTML =
          '<option value="" disabled selected>Select customer first...</option>';
        vehicleSelect.disabled = true;
      }
    }
  }

  updateVehicleList(customerId, targetPlate = null) {
    const vehicleSelect = document.getElementById("sch-vehicle-id");
    if (!vehicleSelect) return;
    const customer = Model.customers.find((c) => c.id == customerId);
    if (!customer || !customer.vehicles?.length) {
      vehicleSelect.innerHTML =
        '<option value="" disabled selected>No vehicles found</option>';
      vehicleSelect.disabled = true;
      return;
    }
    vehicleSelect.innerHTML = customer.vehicles
      .map(
        (v) =>
          `<option value="${v.id ?? v.plate}" ${
            (v.id ?? v.plate) === targetPlate ? "selected" : ""
          }>${v.make} ${v.model} (${v.plate ?? v.id})</option>`,
      )
      .join("");
    vehicleSelect.disabled = false;
  }

  updateCalculatedTime() {
    const checkboxes = document.querySelectorAll(".srv-checkbox:checked");
    let totalHours = 0;
    checkboxes.forEach(
      (cb) => (totalHours += parseFloat(cb.getAttribute("data-time"))),
    );
    const display = document.getElementById("calc-time-display");
    const submitBtn = document.getElementById("sch-submit-btn");
    if (display) display.textContent = totalHours.toFixed(1);
    if (submitBtn) submitBtn.disabled = totalHours === 0;
  }

  async saveScheduleItem(event) {
    event.preventDefault();

    const customerId = document.getElementById("sch-cust-id")?.value;
    const vehicleValue = document.getElementById("sch-vehicle-id")?.value;
    const newStartIdx = parseInt(
      document.getElementById("sch-start-time").value,
    );
    const selectedTechId = document.getElementById("sch-mech-id").value;

    if (!customerId) {
      alert("Please select a valid customer from the search list.");
      return;
    }

    const checkboxes = Array.from(
      document.querySelectorAll(".srv-checkbox:checked"),
    );

    const selectedServices = checkboxes.map((cb) => ({
      id: cb.value,
      name: cb.dataset.name || "",
      time: parseFloat(cb.dataset.time) || 0,
      baseCost: parseFloat(cb.dataset.cost) || 0,
    }));

    if (!selectedServices.length) {
      alert("Please choose at least one service.");
      return;
    }

    let totalHours = 0;
    const serviceNames = [];
    selectedServices.forEach((service) => {
      totalHours += service.time;
      if (service.name) serviceNames.push(service.name);
    });

    const slotsNeeded = Math.max(1, Math.ceil(totalHours / 0.5));

    const customer = Model.customers.find((c) => c.id == customerId);
    const vehicle =
      customer?.vehicles?.find(
        (v) => (v.id ? v.id.toString() : v.plate) === vehicleValue,
      ) || {};
    const tech = Model.mechanicsList.find((m) => m.id === selectedTechId);

    const orderId =
      currentEditingOrderId || `WO-${Math.floor(1000 + Math.random() * 9000)}`;

    const vehicleLabel =
      vehicle?.plate || vehicle?.id
        ? `${vehicle.make || ""} ${vehicle.model || ""} (${vehicle.plate ?? vehicle.id})`.trim()
        : "N/A";

    const newBooking = {
      startIdx: newStartIdx,
      duration: slotsNeeded,
      orderId,
      customerId,
      vehicleId: vehicle.id ?? vehicle.plate ?? vehicleValue,
      customer: customer ? customer.name : "Unknown",
      vehicle: vehicleLabel,
      services: serviceNames.join(", "),
      techName: tech ? tech.name : "Unknown",
      assignedTo: tech ? tech.email : null,
      notes: "Scheduled from Mechify dashboard",
      status: "Pending",
      selectedServices,
      startTime: Model.timeLabels[newStartIdx],
    };

    if (currentEditingOrderId) {
      Model.removeBooking(
        pendingScheduleData.date,
        pendingScheduleData.mechId,
        currentEditingOrderId,
      );
    }

    const success = await Model.addBooking(
      pendingScheduleData.date,
      selectedTechId,
      newBooking,
    );

    if (success) {
      this.closeScheduleModal();
      this.renderScheduleGrid();
    } else {
      // If addBooking failed (due to collision), keep the modal open and let the alert from Model handle feedback.
      // No need to switch tabs or close modal if booking failed.
    }
  }

  removeScheduleItem(mechId, startIdx) {
    if (confirm("Are you sure you want to remove this booking?")) {
      const dayData =
        Model.scheduleData[Model.currentActiveDate]?.[mechId] || [];
      const item = dayData.find((i) => i.startIdx === startIdx);

      if (item) {
        Model.removeBooking(Model.currentActiveDate, mechId, item.orderId);
        this.renderScheduleGrid();
      }
    }
  }

  closeScheduleModal() {
    document.getElementById("schedule-modal-overlay")?.remove();
    pendingScheduleData = null;
    currentEditingOrderId = null;
  }
}

export const scheduleView = new ScheduleView();
