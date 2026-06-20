/**
 * Page Object Model for Login Page
 * https://rahulshettyacademy.com/loginpagePractise/
 */

class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.usernameInput = page.locator('input[type="text"]').first();
    this.passwordInput = page.locator('input[type="password"]').first();
    this.adminRadio = page.locator('input[value="admin"]');
    this.userRadio = page.locator('input[value="user"]');
    this.studentDropdown = page.locator('select').first();
    this.termsCheckbox = page.locator('input[type="checkbox"]');
    this.signInButton = page.locator('input[value="Sign In"]');
    this.termsLink = page.locator('a[href="#"]');
    this.okayButton = page.locator('#okayBtn');
  }

  /**
   * Navigate to login page
   */
  async navigateToLoginPage() {
    await this.page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  }

  /**
   * Close modal popup if exists
   */
  async closeModalIfExists() {
    try {
      if (await this.okayButton.isVisible({ timeout: 2000 })) {
        await this.okayButton.click();
        await this.page.waitForTimeout(500);
      }
    } catch (e) {
      console.log('No modal to close');
    }
  }

  /**
   * Enter username
   * @param {string} username - Username to enter
   */
  async enterUsername(username) {
    await this.usernameInput.click();
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
  }

  /**
   * Enter password
   * @param {string} password - Password to enter
   */
  async enterPassword(password) {
    await this.passwordInput.click();
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  /**
   * Select user type
   * @param {string} userType - 'admin' or 'user'
   */
  async selectUserType(userType) {
    if (userType.toLowerCase() === 'admin') {
      await this.adminRadio.click();
    } else if (userType.toLowerCase() === 'user') {
      await this.userRadio.click();
    }
  }

  /**
   * Select option from dropdown
   * @param {string} option - Option to select (stud, teach, consult)
   */
  async selectDropdownOption(option) {
    await this.studentDropdown.selectOption(option);
  }

  /**
   * Check/accept terms and conditions
   */
  async acceptTerms() {
    await this.termsCheckbox.check();
  }

  /**
   * Verify terms checkbox is checked
   */
  async isTermsChecked() {
    return await this.termsCheckbox.isChecked();
  }

  /**
   * Click Sign In button
   */
  async clickSignIn() {
    await this.signInButton.click();
  }

  /**
   * Get error message if login fails
   */
  async getErrorMessage() {
    try {
      const errorElement = this.page.locator('.alert-danger, .error, .invalid-feedback');
      if (await errorElement.isVisible()) {
        return await errorElement.textContent();
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Verify successful login by checking URL change or page title
   */
  async isLoginSuccessful() {
    try {
      // Check if URL has changed from login page
      const currentUrl = this.page.url();
      if (!currentUrl.includes('loginpagePractise')) {
        return true;
      }
      
      // Check for page title change or specific success indicators
      const pageTitle = await this.page.title();
      if (pageTitle && !pageTitle.includes('LoginPage')) {
        return true;
      }
      
      // Wait for redirection
      await this.page.waitForURL(/angularpractice|success|dashboard/, {
        timeout: 5000
      }).catch(() => null);
      
      const finalUrl = this.page.url();
      return !finalUrl.includes('loginpagePractise');
    } catch (e) {
      return false;
    }
  }

  /**
   * Complete login flow
   * @param {string} username - Username
   * @param {string} password - Password
   * @param {string} userType - User type (admin/user)
   * @param {string} role - Role from dropdown (Student/Teacher/Consultant)
   */
  async login(username, password, userType = 'admin', role = 'Student') {
    await this.closeModalIfExists();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.selectUserType(userType);
    await this.selectDropdownOption(role);
    await this.acceptTerms();
    await this.clickSignIn();
  }

  /**
   * Get page title
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentURL() {
    return this.page.url();
  }
}

module.exports = LoginPage;
