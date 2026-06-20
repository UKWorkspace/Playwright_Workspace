# Playwright Page Object Model (POM) Framework

This project demonstrates the **Page Object Model** design pattern using Playwright for automated testing.

## 📁 Project Structure

```
UK_playwright_JS/
├── pages/
│   └── LoginPage.js              # Page Object for Login Page
├── tests/
│   ├── login.spec.js             # Test cases using LoginPage POM
│   ├── UITest.spec.js            # Other existing tests
│   └── newfile.spec.js           # Other existing tests
├── utils/
│   └── testFixtures.js           # Custom Playwright fixtures
├── playwright.config.js           # Playwright configuration
├── mcp.json                       # MCP Server configuration
├── mcp-server.js                  # MCP Server implementation
└── package.json                   # Project dependencies
```

## 🎯 Page Object Model Pattern

The Page Object Model is a design pattern that:
- **Encapsulates page elements** in a reusable class
- **Reduces code duplication** across test files
- **Improves maintainability** when UI elements change
- **Makes tests more readable** and maintainable

### LoginPage.js (Page Object)

The `LoginPage` class encapsulates all interactions with the login page:

```javascript
class LoginPage {
  constructor(page) {
    // Locators for page elements
    this.usernameInput = page.locator('input[type="text"]').first();
    this.passwordInput = page.locator('input[type="password"]').first();
    // ... other locators
  }

  // Methods for page interactions
  async login(username, password, userType, role) { ... }
  async enterUsername(username) { ... }
  async enterPassword(password) { ... }
  // ... other methods
}
```

### login.spec.js (Test Cases)

Test files use the page object instead of directly interacting with elements:

```javascript
test('TC_001: Successful login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();
  
  await loginPage.login(
    'rahulshettyacademy',
    'Learning@830$3mK2',
    'admin',
    'Student'
  );
  
  const isSuccessful = await loginPage.isLoginSuccessful();
  expect(isSuccessful).toBe(true);
});
```

## 🚀 Running Tests

### Run all tests
```bash
npx playwright test
```

### Run specific test file
```bash
npx playwright test tests/login.spec.js
```

### Run tests in UI mode (recommended for debugging)
```bash
npx playwright test --ui
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run specific test by name
```bash
npx playwright test -g "TC_001"
```

### Generate HTML report
```bash
npx playwright show-report
```

## 📝 Test Cases Included

| Test ID | Description | Credentials |
|---------|-------------|-------------|
| TC_001 | Successful login with valid credentials | rahulshettyacademy / Learning@830$3mK2 |
| TC_002 | Verify page title on login page | - |
| TC_003 | Verify all form elements are present | - |
| TC_004 | Verify user type radio button selection | - |
| TC_005 | Verify dropdown selection | - |
| TC_006 | Verify terms checkbox can be checked | - |
| TC_007 | End-to-end login with different role | rahulshettyacademy / Learning@830$3mK2 |
| TC_008 | Verify form data entry and submission | rahulshettyacademy / Learning@830$3mK2 |

## 🔑 Login Credentials

- **Username:** `rahulshettyacademy`
- **Password:** `Learning@830$3mK2`

## 📚 Page Object Methods

### Navigation & Setup
- `navigateToLoginPage()` - Navigate to login page
- `closeModalIfExists()` - Close modal popup if present

### Form Interactions
- `enterUsername(username)` - Enter username
- `enterPassword(password)` - Enter password
- `selectUserType(userType)` - Select admin or user radio button
- `selectDropdownOption(option)` - Select dropdown option
- `acceptTerms()` - Check terms checkbox
- `clickSignIn()` - Click sign in button

### Verifications
- `isLoginSuccessful()` - Verify successful login
- `isTermsChecked()` - Verify terms checkbox is checked
- `getErrorMessage()` - Get error message if any
- `getPageTitle()` - Get page title
- `getCurrentURL()` - Get current URL

### Complete Flow
- `login(username, password, userType, role)` - Complete login flow

## 🔍 Key Features

✅ **Encapsulation** - All page interactions are in one class  
✅ **Reusability** - Methods can be used across multiple tests  
✅ **Maintainability** - Update locators in one place  
✅ **Readability** - Tests are easy to understand  
✅ **Scalability** - Easy to add new pages and tests  
✅ **Best Practices** - Follows Playwright conventions  

## 🛠️ Technologies Used

- **Playwright** - End-to-end testing framework
- **Node.js** - JavaScript runtime
- **JavaScript (ES6+)** - Programming language

## 📦 Dependencies

```json
{
  "@playwright/test": "^1.59.1",
  "@types/node": "^25.6.0",
  "fast-glob": "^3.x.x",
  "dotenv": "^16.x.x",
  "chalk": "^5.x.x"
}
```

## 🎓 Learning Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Best Practices](https://playwright.dev/docs/pom)
- [Playwright Selectors](https://playwright.dev/docs/selectors)

## 📋 Tips for Using POM

1. **Create one page class per page** - Keep pages separate
2. **Use descriptive method names** - Makes tests self-documenting
3. **Avoid test logic in page objects** - Keep assertions in tests
4. **Use waits wisely** - Let Playwright handle most of it
5. **Document your methods** - Add JSDoc comments
6. **Keep locators updated** - When UI changes, update in one place

## 🤝 Contributing

To add more test cases or page objects:

1. Create new methods in `LoginPage.js` if needed
2. Add new test cases in `tests/login.spec.js`
3. Follow the existing naming conventions
4. Document your changes

---

**Created:** June 4, 2026  
**Framework:** Playwright Page Object Model  
**Website:** https://rahulshettyacademy.com/loginpagePractise/
