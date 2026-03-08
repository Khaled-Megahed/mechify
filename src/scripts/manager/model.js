/**
 * model.js
 * Single source of truth for application data and state
 */

export const Model = {
  // --- APP STATE ---
  currentActiveDate: new Date().toISOString().split("T")[0],

  /**
   * scheduleData Structure:
   * {
   * "2026-03-07": {
   * "mech1": [{
   * startIdx: 0,
   * duration: 3,
   * orderId: "WO-1234",
   * customer: "John Doe",
   * vehicle: "Toyota Camry",
   * services: "Oil Change",
   * techName: "Mike"
   * }],
   * }
   * }
   */
  scheduleData: {},

  // Global list of all work orders for the Work Orders tab
  workOrders: [],

  // --- CUSTOMER DATA ---
  customers: [
    {
      id: 1,
      name: "Mike Ross",
      vehicles: [{ make: "Tesla", model: "Model 3", plate: "ABC-1234" }],
    },
    {
      id: 2,
      name: "Harvey Specter",
      vehicles: [
        { make: "Ford", model: "Mustang", plate: "GT-500" },
        { make: "Land Rover", model: "Defender", plate: "OFF-RD" },
      ],
    },
    {
      id: 3,
      name: "Rachel Zane",
      vehicles: [{ make: "Audi", model: "A4", plate: "LAW-789" }],
    },
  ],

  // --- CONFIGURATION DATA ---
  mechanicsList: [
    { id: "mech1", name: "Bay 1 (Mike)" },
    { id: "mech2", name: "Bay 2 (Sarah)" },
    { id: "mech3", name: "Bay 3 (John)" },
    { id: "mech4", name: "Bay 4 (Alex)" },
  ],

  timeLabels: [
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
  ],

  mockServices: [
    { id: "s1", name: "Oil Change", time: 0.5 },
    { id: "s2", name: "Brake Pad Replacement", time: 1.5 },
    { id: "s3", name: "Tire Rotation", time: 0.5 },
    { id: "s4", name: "Engine Diagnostic", time: 1.0 },
    { id: "s5", name: "Full Transmission Service", time: 2.5 },
  ],

  // --- LOGIC METHODS ---

  /**
   * Checks if a specific time slot is occupied and returns the booking details
   */
  isSlotBooked(date, mechId, slotIdx) {
    const dayData = this.scheduleData[date]?.[mechId] || [];

    for (let item of dayData) {
      if (slotIdx >= item.startIdx && slotIdx < item.startIdx + item.duration) {
        return {
          booked: true,
          isStart: slotIdx === item.startIdx,
          duration: item.duration,
          orderId: item.orderId,
          customer: item.customer,
          vehicle: item.vehicle,
          services: item.services || "",
          techName: item.techName || "Unassigned", // Return techName for the View
        };
      }
    }
    return { booked: false };
  },

  /**
   * Adds a booking to the schedule and syncs with the Work Orders list
   */
  addBooking(date, mechId, booking) {
    if (!this.scheduleData[date]) this.scheduleData[date] = {};
    if (!this.scheduleData[date][mechId]) this.scheduleData[date][mechId] = [];

    // Store the booking in the specific bay
    this.scheduleData[date][mechId].push(booking);

    // Sync to global work orders list with initial status
    if (!this.workOrders) this.workOrders = [];
    this.workOrders.push({
      ...booking,
      status: "Pending",
      progress: 0,
      date: date,
    });
  },
};
