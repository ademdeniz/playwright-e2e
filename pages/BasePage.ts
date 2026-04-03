import { Page, Locator, expect } from '@playwright/test';

/**
 * Base class for all Page Objects.
 * Provides shared navigation, waiting, and assertion helpers.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  async waitForUrl(pattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(pattern, { timeout: 15_000 });
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /** Wait for a selector to be visible */
  async waitForVisible(selector: string): Promise<Locator> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout: 10_000 });
    return locator;
  }

  /** Assert that the page title contains a string */
  async assertTitleContains(text: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(text, 'i'));
  }

  /** Assert that the URL contains a path segment */
  async assertUrlContains(path: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(path));
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path:     `screenshots/${name}.png`,
      fullPage: true,
    });
  }
}
