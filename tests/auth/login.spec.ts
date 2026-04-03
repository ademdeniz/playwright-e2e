import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

/**
 * Authentication test suite.
 * Target: https://the-internet.herokuapp.com/login
 */
test.describe('Authentication', () => {

  test('@smoke valid login navigates to secure area', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    await loginPage.assertLoginSuccess();
    await expect(page).toHaveURL(/secure/);
  });

  test('@smoke invalid password shows error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('tomsmith', 'wrongpassword');
    await loginPage.assertLoginFailure();
    await expect(page).toHaveURL(/login/);
  });

  test('@regression invalid username shows error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('wronguser', 'SuperSecretPassword!');
    const msg = await loginPage.getFlashMessage();
    expect(msg).toContain('Your username is invalid!');
  });

  test('@regression login then logout returns to login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    await loginPage.assertLoginSuccess();
    await loginPage.logout();
    await expect(page).toHaveURL(/login/);
  });

  test('@regression empty credentials show error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', '');
    const msg = await loginPage.getFlashMessage();
    expect(msg.length).toBeGreaterThan(0);
  });
});
