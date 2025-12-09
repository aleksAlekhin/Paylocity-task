const { test, expect } = require("@playwright/test");

require("dotenv").config();

test("Check API authentication", async ({ request }) => {
  console.log("API URL:", process.env.API_URL);
  console.log("Token:", process.env.AUTH_TOKEN?.substring(0, 20) + "...");
  
  const response = await request.get(process.env.API_URL + "/api/Employees", {
    headers: {
      "Authorization": "Basic " + process.env.AUTH_TOKEN
    }
  });
  
  console.log("Response status:", response.status());
  
  if (response.status() === 200) {
    const data = await response.json();
    console.log(" Success. Employees count:", data.length);
  } else {
    const text = await response.text();
    console.log(" Error response:", text.substring(0, 200));
  }
  
  expect(response.status()).toBe(200);
});
