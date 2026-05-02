import { customersView } from "./CustomersView.js";
import { Model } from "../model.js";

jest.mock("../model.js", () => ({
  Model: {
    customers: [],
  },
}));

describe("CustomersView", () => {
  test("createCustomerCard() should format name initials correctly from full name", () => {
    const customer = {
      name: "Mohamed Salah",
      id: "c1",
      vehicles: [],
    };
    const html = customersView.createCustomerCard(customer);
    expect(html).toContain("MS</div>");
    expect(html).toContain("Mohamed Salah</h3>");
  });

  test("render() should display empty state message when database is empty", () => {
    Model.customers = [];
    const html = customersView.render();
    expect(html).toContain("No Customers Found");
  });

  test("render() should generate cards when customers are present in Model", () => {
    Model.customers = [{ name: "Ahmed Hassan", id: "AH1", vehicles: [] }];
    const html = customersView.render();
    expect(html).toContain("Ahmed Hassan</h3>");
    expect(html).not.toContain("No Customers Found");
  });
});
