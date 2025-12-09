class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#Username');
    this.passwordInput = page.locator('#Password');
    this.loginButton = page.locator('body > div > main > div > div > form > button');
    this.errorMessage = page.locator('.text-danger, .error, .alert-danger, [role="alert"]');
  }

  async navigate() {
    await this.page.goto(process.env.UI_URL);
    await this.page.waitForLoadState('networkidle');
  }

  async login() {
    const username = process.env.TEST_USERNAME;
    const password = process.env.TEST_PASSWORD;
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Username from .env (TEST_USERNAME):', username);
    console.log('Password length:', password ? password.length : 0);
    
    const usernameExists = await this.usernameInput.count() > 0;
    const passwordExists = await this.passwordInput.count() > 0;
    const buttonExists = await this.loginButton.count() > 0;
    
    console.log(`Fields found - Username: ${usernameExists}, Password: ${passwordExists}, Button: ${buttonExists}`);
    
    if (!usernameExists || !passwordExists || !buttonExists) {
      console.log('ERROR: Login form not found!');
      await this.page.screenshot({ path: 'reports/login-form-not-found.png', fullPage: true });
      return false;
    }
    
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    
    await this.page.screenshot({ path: 'reports/before-login.png' });
    
    console.log('Clicking login button...');
    await this.loginButton.click();
    
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);
    
    const hasError = await this.errorMessage.count() > 0;
    if (hasError) {
      const errorText = await this.errorMessage.textContent();
      console.log('LOGIN ERROR:', errorText);
    }
    
    await this.page.screenshot({ path: 'reports/after-login.png' });
    
    const finalUrl = this.page.url();
    console.log('Final URL after login attempt:', finalUrl);
    console.log('=== LOGIN COMPLETE ===');
    
    return !finalUrl.includes('/Account/Login');
  }
}

module.exports = LoginPage;
