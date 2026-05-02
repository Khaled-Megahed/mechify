import { servicesView } from "./ServicesView.js";
import { Model } from "../model.js";

jest.mock("../model.js", () => ({
  Model: {
    mockServices: [],
  },
}));

describe("ServicesView", () => {
  test("createServiceCard() should display labor cost and standard hours accurately", () => {
    const service = {
      id: "s1",
      name: "Full Inspection",
      time: 2.5,
      baseCost: 500,
    };
    const html = servicesView.createServiceCard(service);
    expect(html).toContain("Full Inspection</h3>");
    expect(html).toContain("2.5 Standard Hours");
    expect(html).toContain("$500.00</p>");
  });

  test("handleServiceSearch() should toggle DOM visibility based on search query", () => {
    // Setup mock DOM structure required by the search function
    document.body.innerHTML = `
      <div id="services-grid">
        <div class="stat-card"><h3>Oil Change</h3></div>
        <div class="stat-card"><h3>Brake Repair</h3></div>
      </div>
    `;

    const cards = document.querySelectorAll(".stat-card");

    // Execute search for "Brake"
    servicesView.handleServiceSearch("Brake");
    expect(cards[0].style.display).toBe("none");
    expect(cards[1].style.display).toBe("block");

    // Execute empty search (should show all)
    servicesView.handleServiceSearch("");
    expect(cards[0].style.display).toBe("block");
    expect(cards[1].style.display).toBe("block");
  });
});
