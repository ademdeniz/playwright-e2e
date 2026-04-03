import { test, expect } from '@playwright/test';
import { DynamicPage } from '../../pages/DynamicPage';
import { CheckboxPage, DropdownPage } from '../../pages/FormPage';

/**
 * UI interaction tests — async loading, checkboxes, dropdowns.
 * Showcases Playwright's auto-waiting and locator reliability.
 */
test.describe('Dynamic UI', () => {

  test('@smoke dynamic loading completes and shows finish text', async ({ page }) => {
    const dynamicPage = new DynamicPage(page);
    await dynamicPage.goto();
    await dynamicPage.startLoading();
    await dynamicPage.assertLoadingComplete('Hello World!');
  });

  test('@regression loading bar disappears after completion', async ({ page }) => {
    const dynamicPage = new DynamicPage(page);
    await dynamicPage.goto();
    await dynamicPage.startLoading();
    await expect(dynamicPage.finishText).toBeVisible({ timeout: 15_000 });
    await expect(dynamicPage.loadingBar).toBeHidden();
  });
});

test.describe('Checkboxes', () => {

  test('@smoke can check and uncheck checkboxes', async ({ page }) => {
    const cbPage = new CheckboxPage(page);
    await cbPage.goto();

    const count = await cbPage.getCheckboxCount();
    expect(count).toBe(2);

    // Ensure first checkbox is checked
    await cbPage.check(0);
    expect(await cbPage.isChecked(0)).toBe(true);

    // Uncheck it
    await cbPage.uncheck(0);
    expect(await cbPage.isChecked(0)).toBe(false);
  });

  test('@regression second checkbox is checked by default', async ({ page }) => {
    const cbPage = new CheckboxPage(page);
    await cbPage.goto();
    expect(await cbPage.isChecked(1)).toBe(true);
  });
});

test.describe('Dropdown', () => {

  test('@smoke can select an option from dropdown', async ({ page }) => {
    const dropPage = new DropdownPage(page);
    await dropPage.goto();
    await dropPage.selectOption('1');
    await dropPage.assertSelected('1');
  });

  test('@regression can switch between dropdown options', async ({ page }) => {
    const dropPage = new DropdownPage(page);
    await dropPage.goto();
    await dropPage.selectOption('1');
    await dropPage.assertSelected('1');
    await dropPage.selectOption('2');
    await dropPage.assertSelected('2');
  });
});
