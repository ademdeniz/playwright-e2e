import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Locators — defined as getters for lazy evaluation
  get usernameInput() { return this.page.locator('#username'); }
  get passwordInput() { return this.page.locator('#password'); }
  get loginButton()   { return this.page.locator('button[type="submit"]'); }
  get flashMessage()  { return this.page.locator('#flash'); }
  get logoutButton()  { return this.page.locator('a[href="/logout"]'); }

  async goto(): Promise<void> {
    await super.goto('/login');
    await expect(this.usernameInput).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getFlashMessage(): Promise<string> {
    await this.flashMessage.waitFor({ state: 'visible' });
    return (await this.flashMessage.innerText()).trim();
  }

  async assertLoginSuccess(): Promise<void> {
    await expect(this.flashMessage).toContainText('You logged into a secure area!');
    await expect(this.logoutButton).toBeVisible();
  }

  async assertLoginFailure(): Promise<void> {
    await expect(this.flashMessage).toContainText('Your username is invalid!');
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
    await expect(this.flashMessage).toContainText('You logged out of the secure area!');
  }
}
