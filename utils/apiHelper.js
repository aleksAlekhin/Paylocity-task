class ApiHelper {
  constructor(request) {
    this.request = request;
    this.baseUrl = process.env.API_URL;
  }

  async getAllEmployees() {
    const response = await this.request.get(`${this.baseUrl}/api/Employees`);
    return await response.json();
  }

  async createEmployee(data) {
    const response = await this.request.post(`${this.baseUrl}/api/Employees`, {
      data
    });
    return await response.json();
  }

  async deleteEmployee(id) {
    return await this.request.delete(`${this.baseUrl}/api/Employees/${id}`);
  }

  calculateExpectedBenefits(dependantsCount) {
    const employeeCostPerYear = 1000;
    const dependentCostPerYear = 500;
    const paychecksPerYear = 26;
    
    const yearlyCost = employeeCostPerYear + (dependantsCount * dependentCostPerYear);
    return yearlyCost / paychecksPerYear;
  }

  validateEmployeeStructure(employee) {
    const requiredFields = ['id', 'firstName', 'lastName', 'dependants', 'benefitsCost', 'gross', 'net'];
    const missingFields = requiredFields.filter(field => !(field in employee));
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    return true;
  }
}

module.exports = ApiHelper;
