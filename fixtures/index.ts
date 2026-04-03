import { test as base, Page } from '@playwright/test';
import { LoginPage }    from '../pages/LoginPage';
import { DynamicPage }  from '../pages/DynamicPage';
import { CheckboxPage, DropdownPage } from '../pages/FormPage';

/**
 * Extended test fixtures.
 *
 * Injects pre-constructed Page Objects into every test automatically.
 * Tests receive typed POMs without calling `new` themselves.
 *
 * Usage:
 *   import { test } from '../fixtures';
 *   test('my test', async ({ loginPage }) => { ... });
 */
type Fixtures = {
  loginPage:    LoginPage;
  dynamicPage:  DynamicPage;
  checkboxPage: CheckboxPage;
  dropdownPage: DropdownPage;
  authenticatedPage: Page;
};

export const test = base.extend<Fixtures>({

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dynamicPage: async ({ page }, use) => {
    await use(new DynamicPage(page));
  },

  checkboxPage: async ({ page }, use) => {
    await use(new CheckboxPage(page));
  },

  dropdownPage: async ({ page }, use) => {
    await use(new DropdownPage(page));
  },

  /** Provides a page that is already logged in. */
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    await loginPage.assertLoginSuccess();
    await use(page);
  },
});

export { expect } from '@playwright/test';
