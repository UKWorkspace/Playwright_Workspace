import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';

test.describe('Login Page Tests - Page Object Model', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page object before each test
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test('TC_001: Successful login with valid credentials', async ({ page }) => {
    // Arrange
    const username = 'rahulshettyacademy';
    const password = 'Learning@830$3mK2';
    const userType = 'admin';
    const role = 'Student';

    // Act
    await loginPage.login(username, password, userType, role);

    // Assert
    const isSuccessful = await loginPage.isLoginSuccessful();
    expect(isSuccessful).toBe(true);
    console.log('✓ Login successful with valid credentials');
  });

  test('TC_002: Verify page title on login page', async () => {
    // Act
    await loginPage.closeModalIfExists();
    const pageTitle = await loginPage.getPageTitle();

    // Assert
    expect(pageTitle).toContain('LoginPage Practise');
    console.log(`✓ Page title verified: ${pageTitle}`);
  });

  test('TC_003: Verify all form elements are present', async ({ page }) => {
    // Act
    await loginPage.closeModalIfExists();

    // Assert
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.adminRadio).toBeVisible();
    await expect(loginPage.userRadio).toBeVisible();
    await expect(loginPage.studentDropdown).toBeVisible();
    await expect(loginPage.termsCheckbox).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
    console.log('✓ All form elements are visible');
  });

  test('TC_004: Verify user type radio button selection', async () => {
    // Act
    await loginPage.closeModalIfExists();
    await loginPage.selectUserType('admin');
    const isAdminSelected = await loginPage.adminRadio.isChecked();

    // Assert
    expect(isAdminSelected).toBe(true);
    console.log('✓ Admin radio button selected successfully');
  });

  test('TC_005: Verify dropdown selection', async () => {
    // Act
    await loginPage.closeModalIfExists();
    await loginPage.selectDropdownOption('teach');

    // Assert
    const selectedValue = await loginPage.studentDropdown.inputValue();
    expect(selectedValue).toBe('teach');
    console.log('✓ Dropdown option "Teacher" selected successfully');
  });

  test('TC_006: Verify terms checkbox can be checked', async () => {
    // Act
    await loginPage.closeModalIfExists();
    await loginPage.acceptTerms();
    const isChecked = await loginPage.isTermsChecked();

    // Assert
    expect(isChecked).toBe(true);
    console.log('✓ Terms checkbox checked successfully');
  });

  test('TC_007: End-to-end login flow with different role', async () => {
    // Arrange
    const username = 'rahulshettyacademy';
    const password = 'Learning@830$3mK2';
    const userType = 'admin';
    const role = 'teach';

    // Act
    await loginPage.login(username, password, userType, role);

    // Assert
    const isSuccessful = await loginPage.isLoginSuccessful();
    expect(isSuccessful).toBe(true);
    console.log('✓ Login successful with Teacher role');
  });

  test('TC_008: Verify form data entry and submission', async () => {
    // Arrange
    const username = 'rahulshettyacademy';
    const password = 'Learning@830$3mK2';

    // Act
    await loginPage.closeModalIfExists();
    await loginPage.enterUsername(username);
    await loginPage.enterPassword(password);

    // Assert - Verify data was entered
    const usernameValue = await loginPage.usernameInput.inputValue();
    const passwordValue = await loginPage.passwordInput.inputValue();

    expect(usernameValue).toBe(username);
    expect(passwordValue).toBe(password);
    console.log('✓ Username and password entered successfully');
  });
});
