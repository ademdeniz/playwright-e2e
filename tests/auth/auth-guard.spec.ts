import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

/**
 * Auth-guard test suite.
 * Verifies the /secure area is actually protected, not just reachable after login.
 * Generated from specs/login-plan.md (scenarios 6–7).
 */
test.describe('Auth guard', () => {

  test('@regression direct /secure access while logged out redirects to login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto('/secure');
    await expect(page).toHaveURL(/login/);
    await expect(loginPage.flashMessage).toContainText('You must login to view the secure area!');
    await expect(loginPage.flashMessage).toHaveClass(/error/);
  });

  test('@regression session persists across page reload', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    await loginPage.assertLoginSuccess();
    await page.reload();
    await expect(page).toHaveURL(/secure/);
    await expect(loginPage.logoutButton).toBeVisible();
  });
});
