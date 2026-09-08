import { expect, test } from "@playwright/test";

const accountingUrl =
  "/magistrat/hospodareni/vydaje;rok=2018;skupina=22";

test("shows budget item numbers", async ({ page }) => {
  await page.goto(accountingUrl);

  const firstTable = page.locator("table.viztable").first();
  await expect(
    firstTable.getByRole("columnheader", { name: "Číslo položky" }),
  ).toBeVisible();
  await expect(
    firstTable.locator("tbody tr").first().locator("td").first(),
  ).toHaveText(/^\d+$/);
});

test("sorts budget items and keeps the selected order after reload", async ({
  page,
}) => {
  await page.goto(accountingUrl);
  await page.getByRole("button", { name: "Zobrazit všechny akce" }).click();

  const eventHeading = page.getByRole("heading", {
    name: "Radlická radiála JZM Smíchov",
  });
  const table = eventHeading.locator(
    "xpath=../../following-sibling::div[1]//table[contains(@class, 'viztable')]",
  );
  const itemNumbers = table.locator("tbody tr td:first-child");
  const itemSort = page.getByLabel("Řazení položek");

  await expect(itemNumbers).toHaveText(["6130", "6121"]);

  for (const [value, expected] of [
    ["budget-ascending", ["6121", "6130"]],
    ["budget-descending", ["6130", "6121"]],
    ["actual-ascending", ["6130", "6121"]],
    ["actual-descending", ["6121", "6130"]],
    ["number-descending", ["6130", "6121"]],
    ["number-ascending", ["6121", "6130"]],
  ] as const) {
    await itemSort.selectOption(value);
    await expect(itemNumbers).toHaveText(expected);
  }

  await expect(page).toHaveURL(/itemSort=number-ascending/);
  await page.reload();
  await page.getByRole("button", { name: "Zobrazit všechny akce" }).click();
  await expect(page.getByLabel("Řazení položek")).toHaveValue(
    "number-ascending",
  );
  await expect(itemNumbers).toHaveText(["6121", "6130"]);
});
