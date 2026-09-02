import { expect, test } from "@playwright/test";

test("switches between all expenditure overview layouts", async ({ page }) => {
  await page.goto("/praha1/hospodareni/vydaje;rok=2018");

  const cardsButton = page.getByRole("button", { name: "Karty" });
  const mapButton = page.getByRole("button", { name: "Mapa výdajů" });
  const barsButton = page.getByRole("button", { name: "Čerpání rozpočtu" });
  const overview = page.locator(".group-cards");

  await expect(cardsButton).toHaveAttribute("aria-pressed", "true");
  await expect(overview).toHaveAttribute("data-layout", "grid");

  await mapButton.click();

  await expect(
    page.getByRole("heading", { name: "Mapa výdajů" }),
  ).toBeVisible();
  await expect(mapButton).toHaveAttribute("aria-pressed", "true");
  await expect(cardsButton).toHaveAttribute("aria-pressed", "false");
  await expect(overview).toHaveAttribute("data-layout", "map");
  await expect(
    overview.locator(".group-card--map-large").first(),
  ).toBeVisible();
  await expect(
    overview.locator(".group-card--map-small").first(),
  ).toBeVisible();
  await expect(overview.locator(".group-card__amount").first()).toContainText(
    "mil.",
  );
  await expect(overview.getByRole("progressbar").first()).toBeVisible();

  await barsButton.click();

  await expect(
    page.getByRole("heading", { name: "Čerpání rozpočtu podle skupin" }),
  ).toBeVisible();
  await expect(barsButton).toHaveAttribute("aria-pressed", "true");
  await expect(mapButton).toHaveAttribute("aria-pressed", "false");
  await expect(overview).toHaveAttribute("data-layout", "bars");
  await expect(overview.getByText("75 %", { exact: true })).toBeVisible();
  await expect(overview.getByText("100 %", { exact: true })).toBeVisible();
  await expect(overview.locator(".group-card__bar-icon").first()).toBeVisible();
  await expect(
    overview.locator(".group-card__bar-amounts").first(),
  ).toContainText("/");
  await expect(overview.getByRole("progressbar").first()).toBeVisible();

  const progressBox = await overview
    .getByRole("progressbar")
    .first()
    .boundingBox();
  const axis75Box = await overview
    .getByText("75 %", { exact: true })
    .boundingBox();
  const axis100Box = await overview
    .getByText("100 %", { exact: true })
    .boundingBox();

  expect(progressBox).not.toBeNull();
  expect(axis75Box).not.toBeNull();
  expect(axis100Box).not.toBeNull();

  const progressStart = progressBox!.x;
  const progressWidth = progressBox!.width;
  const axis75Center = axis75Box!.x + axis75Box!.width / 2;
  const axis100Center = axis100Box!.x + axis100Box!.width / 2;

  expect(
    Math.abs(axis75Center - (progressStart + progressWidth * 0.75)),
  ).toBeLessThanOrEqual(1);
  expect(
    Math.abs(axis100Center - (progressStart + progressWidth)),
  ).toBeLessThanOrEqual(1);

  await cardsButton.click();

  await expect(overview).toHaveAttribute("data-layout", "grid");
});

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

  const card = cards.last();
  const selectedGroupName =
    (await card.locator(".group-card__name").textContent())?.trim() ?? "";
  expect(selectedGroupName).toBeTruthy();
  await card.scrollIntoViewIfNeeded();
  const scrollPosition = await page.evaluate(() => window.scrollY);
  expect(scrollPosition).toBeGreaterThan(0);

  await card.click();

  await expect(page).toHaveURL(/;skupina=[^;/]+/);
  await expect(card).toHaveClass(/group-card--selected/);
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(async () => {
      const currentPosition = await page.evaluate(() => window.scrollY);
      return Math.abs(currentPosition - scrollPosition);
    })
    .toBeLessThanOrEqual(2);
  await expect(page.locator("#selectedGroup")).toBeVisible();
  await expect(
    page
      .locator("#selectedGroup")
      .getByRole("heading", { name: selectedGroupName, exact: true }),
  ).toBeVisible();

  await card.click();

  await expect(page).not.toHaveURL(/;skupina=/);
  await expect(card).not.toHaveClass(/group-card--selected/);
  await expect(card).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("#selectedGroup")).toBeHidden();

  await card.click();

  await expect(page).toHaveURL(/;skupina=[^;/]+/);
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#selectedGroup")).toBeVisible();
});
