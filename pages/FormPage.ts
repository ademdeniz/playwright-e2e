import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for /login (used as a generic form target)
 * and /checkboxes — demonstrates form interaction patterns.
 */
export class CheckboxPage extends BasePage {
  get checkboxes() { return this.page.locator('input[type="checkbox"]'); }

  async goto(): Promise<void> {
    await super.goto('/checkboxes');
  }

  async getCheckboxCount(): Promise<number> {
    return this.checkboxes.count();
  }

  async isChecked(index: number): Promise<boolean> {
    return this.checkboxes.nth(index).isChecked();
  }

  async check(index: number): Promise<void> {
    await this.checkboxes.nth(index).check();
    await expect(this.checkboxes.nth(index)).toBeChecked();
  }

  async uncheck(index: number): Promise<void> {
    await this.checkboxes.nth(index).uncheck();
    await expect(this.checkboxes.nth(index)).not.toBeChecked();
  }
}

/**
 * Page Object for /dropdown
 */
export class DropdownPage extends BasePage {
  get dropdown() { return this.page.locator('#dropdown'); }

  async goto(): Promise<void> {
    await super.goto('/dropdown');
  }

  async selectOption(value: string): Promise<void> {
    await this.dropdown.selectOption(value);
  }

  async getSelectedValue(): Promise<string> {
    return this.dropdown.inputValue();
  }

  async assertSelected(label: string): Promise<void> {
    await expect(this.dropdown).toHaveValue(label);
  }
}
