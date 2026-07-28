import { expect, test } from "@playwright/test";

test("selects and clears an expenditure group from the card overview", async ({
  page,
}) => {
  await page.goto("/praha1/hospodareni/vydaje;rok=2018");

  await expect(
    page.getByRole("heading", { name: "Výdaje podle skupin" }),
  ).toBeVisible();

  const cards = page.locator(".group-card:not(:disabled)");
  await expect(cards.first()).toBeVisible();
  expect(await cards.count()).toBeGreaterThan(0);

  const firstCard = cards.first();
  await firstCard.click();

  await expect(page).toHaveURL(/;skupina=[^;/]+/);
  await expect(firstCard).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#selectedGroup")).toBeVisible();

  await firstCard.click();

  await expect(page).not.toHaveURL(/;skupina=/);
  await expect(page.locator("#selectedGroup")).toBeHidden();
});
