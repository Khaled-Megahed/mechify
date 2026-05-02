/**
 * model.js
 * Single source of truth for application data and state.
 * Now connected to MockStore (LMDB Simulation)
 */
import { MockStore as data } from "../mockStore.js";

export const Model = {
  // --- APP STATE ---
  currentActiveDate: new Date().toISOString().split("T")[0],

  // Data containers (initialized empty, filled by API)
  scheduleData: {},
  workOrders: [],
  customers: [],
  mockServices: [], // This will store services from /api/Service

  // --- STATIC CONFIGURATION ---
  // Keeping these static as they usually represent physical workshop bays
  mechanicsList: [
    { id: "mech1", name: "Bay 1 (Ali)", email: "ali@gmail.com" },
    { id: "mech2", name: "Bay 2 (Mostafa)", email: "mostafa@gmail.com" },
    { id: "mech3", name: "Bay 3 (Hassan)", email: "hassan@gmail.com" },
    { id: "mech4", name: "Bay 4 (Omar)", email: "omar@gmail.com" },
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

  // --- API INITIALIZATION ---

  /**
   * Fetches all startup data from the backend
   */
  async init() {
    try {
      // Load from MockStore instead of API
      this.mockServices = data.services;
      this.customers = data.customers;
      this.workOrders = data.workOrders;

      // Load the schedule for the default date
      await this.refreshSchedule(this.currentActiveDate);
      console.log("Model synced with Mock Database successfully.");
    } catch (error) {
      console.error("Model Init Error:", error);
    }
  },

  /**
   * Fetches appointments and transforms them into the grid format
   */
  async refreshSchedule(date) {
    try {
      // Ensure we pull latest data from persistent storage for cross-tab sync
      data.load();

      // Clear current schedule for this date to rebuild it
      this.scheduleData[date] = {};

      // Filter or map work orders. In a real app, you'd filter by date here.
      const appointments = this.workOrders;

      appointments.forEach((apppt) => {
        // Map the technician email back to the mech ID (Bay)
        const mechanic = this.mechanicsList.find(
          (m) => m.email === apppt.assignedTo,
        ) ||
          this.mechanicsList.find((m) => m.id === apppt.mechanicId) || {
            id: "mech1",
          };

        const mechId = mechanic.id;
        if (!this.scheduleData[date][mechId])
          this.scheduleData[date][mechId] = [];

        this.scheduleData[date][mechId].push({
          startIdx: apppt.startIdx,
          duration: apppt.duration,
          orderId: apppt.orderId,
          customer: apppt.customer,
          vehicle: apppt.vehicle,
          services: apppt.services,
          techName: apppt.techName,
          assignedTo: apppt.assignedTo,
        });
      });
    } catch (error) {
      console.error("Schedule Fetch Error:", error);
    }
  },

  // --- LOGIC METHODS ---

  /**
   * Checks if a specific time slot is occupied
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
          techName: item.techName || "Unassigned",
        };
      }
    }
    return { booked: false };
  },

  /**
   * Sends a new booking to the Backend
   */
  /**
   * Sends a new booking to the Backend using the CreateWorkOrderDto schema
   */
  async addBooking(date, mechId, bookingData) {
    try {
      const timeLabel =
        bookingData.startTime ||
        this.timeLabels[bookingData.startIdx] ||
        "08:00 AM";
      const [timePart, modifier] = timeLabel.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const scheduledDate = new Date(date);
      scheduledDate.setHours(hours, minutes, 0, 0);

      const payload = {
        scheduledTime: scheduledDate.toISOString(),
        notes: bookingData.notes || "Standard service",
        customerId: bookingData.customerId,
        vehicleId:
          bookingData.vehicleId && bookingData.vehicleId !== ""
            ? bookingData.vehicleId
            : null,
        employeeId: 1,
        mechanicId: mechId,
        duration: bookingData.duration,
        services: (bookingData.selectedServices || []).map((service) => ({
          serviceId: parseInt(service.id, 10),
          quantity: 1,
          unitCost: parseFloat(service.baseCost) || 0,
        })),
      };

      const newWO = {
        ...bookingData,
      };
      data.workOrders.push(newWO);
      data.save();

      await this.init();
      return true;
    } catch (error) {
      console.error("Booking failed:", error);

      if (!this.scheduleData[date]) {
        this.scheduleData[date] = {};
      }
      if (!this.scheduleData[date][mechId]) {
        this.scheduleData[date][mechId] = [];
      }
      this.scheduleData[date][mechId].push({
        ...bookingData,
      });
      this.workOrders.push({
        orderId: bookingData.orderId,
        customer: bookingData.customer,
        status: bookingData.status,
        techName: bookingData.techName,
        services: bookingData.services,
      });

      alert("Error: " + error.message + ". Added locally for demo purposes.");
      return false;
    }
  },

  async addService(serviceData) {
    const newService = {
      id: `s${Math.floor(Math.random() * 1000)}`,
      ...serviceData,
    };
    data.services.push(newService);
    data.save();
    await this.init();
  },

  async deleteService(id) {
    data.services = data.services.filter((s) => s.id != id);
    data.save();
    await this.init();
  },

  async addCustomer(customerData, vehicleData) {
    const newCustomer = {
      id: `c${Math.floor(Math.random() * 1000)}`,
      ...customerData,
      vehicles: [
        {
          id: `v${Math.floor(Math.random() * 1000)}`,
          ...vehicleData,
        },
      ],
    };
    data.customers.push(newCustomer);
    data.save();
    await this.init();
  },

  async deleteCustomer(id) {
    data.customers = data.customers.filter((c) => c.id != id);
    data.save();
    await this.init();
  },

  async removeBooking(date, mechId, orderId) {
    if (!this.scheduleData[date] || !this.scheduleData[date][mechId]) return;

    this.scheduleData[date][mechId] = this.scheduleData[date][mechId].filter(
      (item) => item.orderId !== orderId,
    );

    const orderIndex = data.workOrders.findIndex((o) => o.orderId === orderId);
    if (orderIndex !== -1) {
      data.workOrders.splice(orderIndex, 1);
    }

    data.save();
  },
};
