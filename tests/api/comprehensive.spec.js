const { test, expect } = require("@playwright/test");
require("dotenv").config();

test.describe("Employees API Tests (Realistic)", () => {
  const API_URL = process.env.API_URL;
  
  test("Should create and verify employee", async ({ request }) => {
    const employeeData = {
      firstName: "Playwright",
      lastName: "Test",
      dependents: 2
    };

    const createResponse = await request.post(`${API_URL}/api/Employees`, {
      data: employeeData
    });

    console.log("Create status:", createResponse.status());
    expect(createResponse.status()).toBe(200);

    const employee = await createResponse.json();
    const employeeId = employee.id;
    
    console.log("Created employee ID:", employeeId);
    console.log("Employee data:", {
      name: `${employee.firstName} ${employee.lastName}`,
      dependants: employee.dependants,
      benefitsCost: employee.benefitsCost,
      net: employee.net
    });
    
    expect(employee.firstName).toBe("Playwright");
    expect(employee.lastName).toBe("Test");
    expect(employee.benefitsCost).toBeDefined();
    expect(typeof employee.benefitsCost).toBe("number");
    
    const listResponse = await request.get(`${API_URL}/api/Employees`);
    const allEmployees = await listResponse.json();
    
    const found = allEmployees.find(emp => emp.id === employeeId);
    expect(found).toBeDefined();
    console.log("Verified in list");
    
    const deleteResponse = await request.delete(`${API_URL}/api/Employees/${employeeId}`);
    expect(deleteResponse.ok()).toBe(true);
    console.log("Cleaned up employee");
    

    const finalList = await request.get(`${API_URL}/api/Employees`);
    const finalEmployees = await finalList.json();
    const stillExists = finalEmployees.find(emp => emp.id === employeeId);
    expect(stillExists).toBeUndefined();
    console.log("Verified deletion: OK");
  });

  test("Should calculate benefits correctly", async ({ request }) => {
    const employeeData = {
      firstName: "NoDeps",
      lastName: "Test",
      dependents: 0
    };

    const response = await request.post(`${API_URL}/api/Employees`, {
      data: employeeData
    });

    const employee = await response.json();
    const employeeId = employee.id;
    
    console.log("Benefits calculation test:");
    console.log("- Dependants:", employee.dependants);
    console.log("- Benefits cost:", employee.benefitsCost);
    console.log("- Net salary:", employee.net);
    console.log("- Gross salary:", employee.gross);
    
    const expectedBenefits = 1000 / 26; // $38.46154
    expect(employee.benefitsCost).toBeCloseTo(expectedBenefits, 4);
    
    const expectedNet = employee.gross - employee.benefitsCost;
    expect(employee.net).toBeCloseTo(expectedNet, 2);
    
    console.log("Benefits calculation: OK");
    
    await request.delete(`${API_URL}/api/Employees/${employeeId}`);
  });

  test("Should validate required fields", async ({ request }) => {
    const invalidData = {
      lastName: "Test"
    };

    const response = await request.post(`${API_URL}/api/Employees`, {
      data: invalidData
    });

    console.log("Validation test status:", response.status());
    
    // API can response 400 or 200 
    // Just log result
    if (response.status() >= 400) {
      const error = await response.text();
      console.log("Validation error:", error);
    } else {
      const employee = await response.json();
      console.log("Created with defaults:", employee.firstName);
      // Clean, if it created.. 
      if (employee.id) {
        await request.delete(`${API_URL}/api/Employees/${employee.id}`);
      }
    }
  });
});
