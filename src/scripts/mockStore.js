/**
 * mockStore.js
 * A browser-side simulation of the LMDB database defined in init.js.
 */
export const MockStore = {
  users: [
    {
      email: "manager@gmail.com",
      name: "Ahmed Hassan",
      role: "Manager",
      password: "password123",
      initials: "AH",
    },
    {
      email: "ali@gmail.com",
      name: "Ali Mahmoud",
      role: "Mechanic",
      password: "password123",
      initials: "AM",
    },
    {
      email: "mostafa@gmail.com",
      name: "Mostafa Adel",
      role: "Mechanic",
      password: "password123",
      initials: "MA",
    },
    {
      email: "hassan@gmail.com",
      name: "Hassan Tarek",
      role: "Mechanic",
      password: "password123",
      initials: "HT",
    },
    {
      email: "omar@gmail.com",
      name: "Omar Khaled",
      role: "Mechanic",
      password: "password123",
      initials: "OK",
    },
  ],
  customers: [
    {
      id: "c1",
      name: "Mohamed Salah",
      email: "mo.salah@liverpool.com",
      phone: "01111111111",
      vehicles: [
        {
          id: "v1",
          make: "Toyota",
          model: "Corolla 2020",
          licensePlate: "LFC-11",
        },
      ],
    },
    {
      id: "c2",
      name: "Khaled Ali",
      email: "khaled.ali@gmail.com",
      phone: "01111111112",
      vehicles: [
        {
          id: "v2",
          make: "Hyundai",
          model: "Elantra 2019",
          licensePlate: "KLD-44",
        },
      ],
    },
    {
      id: "c3",
      name: "Youssef Ahmed",
      email: "youssef.a@outlook.com",
      phone: "01111111113",
      vehicles: [
        {
          id: "v3",
          make: "Kia",
          model: "Sportage 2021",
          licensePlate: "YOS-77",
        },
      ],
    },
    {
      id: "c4",
      name: "Amr Samy",
      email: "amr.samy@yahoo.com",
      phone: "01111111114",
      vehicles: [
        {
          id: "v4",
          make: "Nissan",
          model: "Sunny 2018",
          licensePlate: "AMR-22",
        },
      ],
    },
    {
      id: "c5",
      name: "Karim Nabil",
      email: "karim.n@gmail.com",
      phone: "01111111115",
      vehicles: [
        {
          id: "v5",
          make: "Chevrolet",
          model: "Optra 2017",
          licensePlate: "KRM-55",
        },
      ],
    },
    {
      id: "c6",
      name: "Tarek Hegazy",
      email: "tarek.h@gmail.com",
      phone: "01111111116",
      vehicles: [
        {
          id: "v6",
          make: "Mitsubishi",
          model: "Lancer 2016",
          licensePlate: "TRK-09",
        },
      ],
    },
    {
      id: "c7",
      name: "Sara Younes",
      email: "sara.y@gmail.com",
      phone: "01111111117",
      vehicles: [
        {
          id: "v7",
          make: "Renault",
          model: "Kadjar 2022",
          licensePlate: "SRA-88",
        },
      ],
    },
    {
      id: "c8",
      name: "Mahmoud El-Sayed",
      email: "mahmoud.e@gmail.com",
      phone: "01111111118",
      vehicles: [
        {
          id: "v8",
          make: "Skoda",
          model: "Octavia 2021",
          licensePlate: "MHD-33",
        },
      ],
    },
    {
      id: "c9",
      name: "Nora Fawzy",
      email: "nora.f@gmail.com",
      phone: "01111111119",
      vehicles: [
        {
          id: "v9",
          make: "Peugeot",
          model: "3008 2023",
          licensePlate: "NRA-10",
        },
      ],
    },
    {
      id: "c10",
      name: "Ziad Badr",
      email: "ziad.b@gmail.com",
      phone: "01111111120",
      vehicles: [
        {
          id: "v10",
          make: "Ford",
          model: "Focus 2019",
          licensePlate: "ZID-66",
        },
      ],
    },
  ],
  workOrders: [
    {
      orderId: "WO-101",
      customer: "Mohamed Salah",
      customerId: "c1",
      vehicle: "Toyota Corolla 2020",
      services: "Oil Change",
      status: "In Progress",
      techName: "Ali Mahmoud",
      assignedTo: "ali@gmail.com",
      startIdx: 2,
      duration: 1,
    },
    {
      orderId: "WO-102",
      customer: "Khaled Ali",
      customerId: "c2",
      vehicle: "Hyundai Elantra 2019",
      services: "Brake Inspection",
      status: "Pending",
      techName: "Unassigned",
      assignedTo: null,
      startIdx: 6,
      duration: 1,
    },
  ],
  services: [
    { id: "s1", name: "Oil Change", time: 0.5, baseCost: 300.0 },
    { id: "s2", name: "Brake Inspection", time: 0.35, baseCost: 200.0 },
    { id: "s3", name: "Engine Diagnostics", time: 0.75, baseCost: 500.0 },
    { id: "s4", name: "Battery Replacement", time: 0.4, baseCost: 800.0 },
    { id: "s5", name: "Tire Replacement", time: 0.65, baseCost: 600.0 },
    { id: "s6", name: "Wheel Alignment", time: 0.5, baseCost: 350.0 },
    { id: "s7", name: "AC Repair", time: 1.0, baseCost: 700.0 },
    { id: "s8", name: "Transmission Check", time: 1.15, baseCost: 900.0 },
    { id: "s9", name: "Suspension Repair", time: 1.35, baseCost: 1000.0 },
    { id: "s10", name: "Full Car Inspection", time: 1.5, baseCost: 1200.0 },
    { id: "s11", name: "Spark Plug Replacement", time: 0.8, baseCost: 400.0 },
    { id: "s12", name: "Coolant Flush", time: 0.6, baseCost: 250.0 },
    {
      id: "s13",
      name: "Power Steering Fluid Service",
      time: 0.45,
      baseCost: 150.0,
    },
    { id: "s14", name: "Fuel System Cleaning", time: 0.9, baseCost: 450.0 },
    { id: "s15", name: "Exhaust System Repair", time: 1.25, baseCost: 850.0 },
  ],

  // Persistent storage simulation
  save() {
    localStorage.setItem(
      "mechify_mock_db",
      JSON.stringify({
        users: this.users,
        workOrders: this.workOrders,
        customers: this.customers,
        services: this.services,
      }),
    );
  },

  load() {
    const saved = localStorage.getItem("mechify_mock_db");
    if (saved) {
      const data = JSON.parse(saved);

      // Use splice to clear and push to repopulate.
      // This ensures any code holding a reference to these arrays sees the updates.
      if (data.users) this.users.splice(0, this.users.length, ...data.users);
      if (data.workOrders)
        this.workOrders.splice(0, this.workOrders.length, ...data.workOrders);
      if (data.customers)
        this.customers.splice(0, this.customers.length, ...data.customers);
      if (data.services)
        this.services.splice(0, this.services.length, ...data.services);
    }
  },
};

// Initialize on load
MockStore.load();
