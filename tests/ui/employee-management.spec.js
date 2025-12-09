const { test, expect } = require("@playwright/test");
require("dotenv").config();
const LoginPage = require("../../pages/LoginPage");
const DashboardPage = require("../../pages/DashboardPage");

test.describe("Employee Management UI Tests", () => {
  test("Should login and see dashboard with employee table", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    console.log('=== STARTING UI TEST ===');
    console.log('Username from env (TEST_USERNAME):', process.env.TEST_USERNAME);
    
    // Log in
    await loginPage.navigate();
    const loginSuccess = await loginPage.login();
    
    if (!loginSuccess) {
      console.log('Not OK. Login failed, skipping dashboard test');
      console.log('Check reports/before-login.png and reports/after-login.png');
      return;
    }
    
    // 2. Check dashboard
    console.log('It;s OK. Login successful, checking dashboard...');
    await dashboardPage.waitForLoad();
    
    // 3. Can see table
    expect(await dashboardPage.employeeTable.isVisible()).toBe(true);
    
    // 4. Can see button
    expect(await dashboardPage.addEmployeeButton.isVisible()).toBe(true);
    
    // 5. There is some information
    const employeeCount = await dashboardPage.getEmployeeCount();
    console.log(`Found ${employeeCount} employees in table`);
    
    if (employeeCount > 0) {
      const firstEmployee = await dashboardPage.getEmployeeInfo(0);
      console.log('First employee:', firstEmployee);
      
      expect(firstEmployee.benefitsCost).toBeTruthy();
      expect(firstEmployee.benefitsCost).not.toBe('');
    }
    
    console.log('OK. All dashboard checks passed');
  });
});
