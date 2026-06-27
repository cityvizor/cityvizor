import { expect, test } from "@playwright/test";

test("shows invoices for a city profile", async ({ page }) => {
  await page.goto("/praha1");

  await page.locator('a.nav-link[href="/praha1/faktury"]').click();
  await expect(page).toHaveURL(/\/praha1\/faktury/);

  const invoices = page.locator(".invoices tbody tr");
  await expect(invoices.first()).toBeVisible();
  await expect(invoices).not.toHaveCount(0);
});
