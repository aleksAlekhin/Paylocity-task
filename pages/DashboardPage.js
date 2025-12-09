class DashboardPage {
  constructor(page) {
    this.page = page;
    this.addEmployeeButton = page.locator('#add');
    this.employeeTable = page.locator('#employeesTable');
    this.employeeRows = page.locator('#employeesTable tbody tr');
  }

  async waitForLoad() {
    await this.page.waitForSelector('#employeesTable', { timeout: 10000 });
    
    const url = this.page.url();
    console.log('Dashboard loaded. URL:', url);
    
    const hasTable = await this.employeeTable.count() > 0;
    const hasAddButton = await this.addEmployeeButton.count() > 0;
    
    console.log(`Table found: ${hasTable}, Add button found: ${hasAddButton}`);
    
    if (hasTable) {
      const rowCount = await this.employeeRows.count();
      console.log(`Employee table has ${rowCount} rows`);
    }
    
    await this.page.screenshot({ path: 'reports/dashboard-loaded.png' });
  }

  async getEmployeeCount() {
    return await this.employeeRows.count();
  }

  async clickAddEmployee() {
    await this.addEmployeeButton.click();
  }

  async getEmployeeInfo(rowIndex) {
    const row = this.employeeRows.nth(rowIndex);
    const cells = row.locator('td');
    
    return {
      firstName: await cells.nth(0).textContent(),
      lastName: await cells.nth(1).textContent(),
      dependants: await cells.nth(2).textContent(),
      salary: await cells.nth(3).textContent(),
      gross: await cells.nth(4).textContent(),
      benefitsCost: await cells.nth(5).textContent(),
      net: await cells.nth(6).textContent(),
    };
  }
}

module.exports = DashboardPage;
