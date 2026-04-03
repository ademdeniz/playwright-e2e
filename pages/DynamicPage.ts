import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for /dynamic_loading — tests async UI patterns.
 * Demonstrates Playwright's superior auto-waiting vs Selenium.
 */
export class DynamicPage extends BasePage {
  get startButton()  { return this.page.locator('#start button'); }
  get loadingBar()   { return this.page.locator('#loading'); }
  get finishText()   { return this.page.locator('#finish'); }

  async goto(): Promise<void> {
    await super.goto('/dynamic_loading/1');
  }

  async startLoading(): Promise<void> {
    await this.startButton.click();
  }

  async waitForFinish(): Promise<string> {
    // Playwright auto-waits — no explicit sleep needed
    await expect(this.finishText).toBeVisible({ timeout: 15_000 });
    return (await this.finishText.innerText()).trim();
  }

  async assertLoadingComplete(expectedText: string): Promise<void> {
    await expect(this.finishText).toContainText(expectedText, { timeout: 15_000 });
  }
}
