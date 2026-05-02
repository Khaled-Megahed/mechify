import { dashboardView } from "./DashboardView.js";
import { Model } from "../model.js";

// Mock the Model dependency to isolate View logic
jest.mock("../model.js", () => ({
  Model: {
    workOrders: [],
    customers: [],
  },
}));

describe("DashboardView", () => {
  beforeEach(() => {
    // Reset mock data before each test execution
    Model.workOrders = [];
    Model.customers = [];
  });

  test("render() should correctly calculate revenue and completion rate based on order status", () => {
    // Setup mock state with mixed statuses
    Model.workOrders = [
      { status: "Completed" },
      { status: "Completed" },
      { status: "In Progress" },
      { status: "Pending" },
    ];

    const html = dashboardView.render();

    // Revenue: 2 completed orders * $150.00 = $300.00
    expect(html).toContain("$300.00");
    // Total orders display
    expect(html).toContain("4</h3>");
    // Completion Rate calculation: (2 completed / 4 total) * 100 = 50.0%
    expect(html).toContain("50.0%");
  });

  test("renderStatCard() should return HTML with expected color classes and label", () => {
    const html = dashboardView.renderStatCard("Active Jobs", 15, "cyan");
    expect(html).toContain("Active Jobs");
    expect(html).toContain("15</h3>");
    expect(html).toContain("border-cyan-400");
  });
});
