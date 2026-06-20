/**
 * Quick Reference: Using Page Object Model (POM) with Playwright
 * 
 * This file shows practical examples of using the LoginPage page object
 */

// ============================================
// EXAMPLE 1: Simple Login
// ============================================
async function example1_SimpleLogin(page) {
  const { LoginPage } = require('../pages/LoginPage');
  const loginPage = new LoginPage(page);
  
  await loginPage.navigateToLoginPage();
  await loginPage.login(
    'rahulshettyacademy',           // username
    'Learning@830$3mK2',             // password
    'admin',                          // userType: admin or user
    'stud'                            // role: stud, teach, consult
  );
  
  const isLoggedIn = await loginPage.isLoginSuccessful();
  console.log('Login successful:', isLoggedIn);
}

// ============================================
// EXAMPLE 2: Step-by-Step Login
// ============================================
async function example2_StepByStepLogin(page) {
  const { LoginPage } = require('../pages/LoginPage');
  const loginPage = new LoginPage(page);
  
  // Step 1: Navigate
  await loginPage.navigateToLoginPage();
  
  // Step 2: Close modal if exists
  await loginPage.closeModalIfExists();
  
  // Step 3: Fill form fields individually
  await loginPage.enterUsername('rahulshettyacademy');
  await loginPage.enterPassword('Learning@830$3mK2');
  
  // Step 4: Select options
  await loginPage.selectUserType('admin');     // admin or user
  await loginPage.selectDropdownOption('teach'); // stud, teach, consult
  
  // Step 5: Accept terms
  await loginPage.acceptTerms();
  
  // Step 6: Submit
  await loginPage.clickSignIn();
}

// ============================================
// EXAMPLE 3: Validation Test
// ============================================
async function example3_FormValidation(page) {
  const { LoginPage } = require('../pages/LoginPage');
  const loginPage = new LoginPage(page);
  
  await loginPage.navigateToLoginPage();
  await loginPage.closeModalIfExists();
  
  // Verify all form elements are present
  const elements = {
    username: await loginPage.usernameInput.isVisible(),
    password: await loginPage.passwordInput.isVisible(),
    adminRadio: await loginPage.adminRadio.isVisible(),
    userRadio: await loginPage.userRadio.isVisible(),
    dropdown: await loginPage.studentDropdown.isVisible(),
    termsCheckbox: await loginPage.termsCheckbox.isVisible(),
    signIn: await loginPage.signInButton.isVisible()
  };
  
  console.log('Form elements visible:', elements);
  return elements;
}

// ============================================
// EXAMPLE 4: Using with Playwright Test
// ============================================
import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';

test('Login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // Arrange
  const credentials = {
    username: 'rahulshettyacademy',
    password: 'Learning@830$3mK2',
    userType: 'admin',
    role: 'stud'
  };
  
  // Act
  await loginPage.navigateToLoginPage();
  await loginPage.login(
    credentials.username,
    credentials.password,
    credentials.userType,
    credentials.role
  );
  
  // Assert
  const success = await loginPage.isLoginSuccessful();
  expect(success).toBe(true);
});

// ============================================
// EXAMPLE 5: Error Handling
// ============================================
async function example5_ErrorHandling(page) {
  const { LoginPage } = require('../pages/LoginPage');
  const loginPage = new LoginPage(page);
  
  await loginPage.navigateToLoginPage();
  await loginPage.closeModalIfExists();
  
  // Try login with invalid credentials
  await loginPage.enterUsername('invalid_user');
  await loginPage.enterPassword('invalid_pass');
  await loginPage.selectUserType('admin');
  await loginPage.selectDropdownOption('stud');
  await loginPage.acceptTerms();
  await loginPage.clickSignIn();
  
  // Check for error
  const errorMsg = await loginPage.getErrorMessage();
  console.log('Error message:', errorMsg);
}

// ============================================
// EXAMPLE 6: Data-Driven Testing
// ============================================
const testData = [
  {
    username: 'rahulshettyacademy',
    password: 'Learning@830$3mK2',
    userType: 'admin',
    role: 'stud',
    expected: true
  },
  {
    username: 'rahulshettyacademy',
    password: 'Learning@830$3mK2',
    userType: 'user',
    role: 'teach',
    expected: true
  },
  {
    username: 'invalid',
    password: 'invalid',
    userType: 'admin',
    role: 'consult',
    expected: false
  }
];

async function example6_DataDrivenTesting(page) {
  const { LoginPage } = require('../pages/LoginPage');
  const loginPage = new LoginPage(page);
  
  for (const testCase of testData) {
    console.log(`\nTesting: ${testCase.username}`);
    
    await loginPage.navigateToLoginPage();
    await loginPage.closeModalIfExists();
    
    await loginPage.login(
      testCase.username,
      testCase.password,
      testCase.userType,
      testCase.role
    );
    
    const result = await loginPage.isLoginSuccessful();
    console.log(
      `Result: ${result === testCase.expected ? '✓ PASS' : '✗ FAIL'}`
    );
  }
}

// ============================================
// PAGE OBJECT METHODS REFERENCE
// ============================================
/*
Navigation:
- navigateToLoginPage()
- closeModalIfExists()

Input Actions:
- enterUsername(username)
- enterPassword(password)
- selectUserType(userType)        // 'admin' or 'user'
- selectDropdownOption(option)    // 'stud', 'teach', 'consult'
- acceptTerms()

Submission:
- clickSignIn()

Verification:
- isLoginSuccessful()
- isTermsChecked()
- getErrorMessage()
- getPageTitle()
- getCurrentURL()

Complete Flow:
- login(username, password, userType, role)

Locators (for advanced usage):
- usernameInput
- passwordInput
- adminRadio
- userRadio
- studentDropdown
- termsCheckbox
- signInButton
- termsLink
- okayButton
*/

// ============================================
// DROPDOWN VALUES
// ============================================
/*
The dropdown has these values:
- 'stud'   (displays as "Student")
- 'teach'  (displays as "Teacher")
- 'consult' (displays as "Consultant")

Always use the values ('stud', 'teach', 'consult') not the display text.
*/

// ============================================
// RADIO BUTTON VALUES
// ============================================
/*
User Type radio buttons:
- 'admin'  (Admin option)
- 'user'   (User option)

Always use lowercase values.
*/

module.exports = {
  example1_SimpleLogin,
  example2_StepByStepLogin,
  example3_FormValidation,
  example5_ErrorHandling,
  example6_DataDrivenTesting
};
