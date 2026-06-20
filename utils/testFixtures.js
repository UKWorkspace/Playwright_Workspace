/**
 * Test Fixtures and Utilities
 * Provides common setup for tests
 */

import { test as base } from '@playwright/test';
import LoginPage from '../pages/LoginPage';

/**
 * Extend test with custom fixtures
 */
export const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await use(loginPage);
  }
});

export { expect } from '@playwright/test';
