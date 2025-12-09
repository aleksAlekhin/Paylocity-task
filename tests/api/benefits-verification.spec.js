const { test, expect } = require("@playwright/test");
require("dotenv").config();
const ApiHelper = require("../../utils/apiHelper");

test.describe("Benefits Calculation Verification", () => {
  let apiHelper;
  const testEmployees = [];

  test.beforeEach(async ({ request }) => {
    apiHelper = new ApiHelper(request);
  });

  test.afterEach(async () => {
    for (const employee of testEmployees) {
      if (employee.id) {
        await apiHelper.deleteEmployee(employee.id);
      }
    }
  });

  test("Should calculate benefits correctly per business rules", async () => {
    const employeeData = { firstName: "Benefits", lastName: "Test", dependents: 2 };
    const employee = await apiHelper.createEmployee(employeeData);
    testEmployees.push(employee);

    const expected = apiHelper.calculateExpectedBenefits(employee.dependants);
    console.log(`Expected: $${expected.toFixed(5)}, Actual: $${employee.benefitsCost}`);
    
    expect(employee.benefitsCost).toBeCloseTo(expected, 4);
    expect(employee.net).toBeCloseTo(employee.gross - employee.benefitsCost, 2);
  });
});
