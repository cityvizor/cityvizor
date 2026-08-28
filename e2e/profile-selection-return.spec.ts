import { expect, test } from "@playwright/test";

test("returns to the profile selection page with filters restored", async ({
  page,
}) => {
  await page.goto("/landing/?selectionProfile=13");

  await expect(
    page.getByRole("heading", { name: "Turnov a jeho části" }),
  ).toBeVisible();

  await page.getByLabel("Hledat organizaci").fill("Galerie");
  await page.getByLabel("Kategorie").selectOption({ label: "Nezařazeno" });
  await page
    .getByLabel("Zřizovatel")
    .selectOption({ label: "Turnov 1" });

  await page.getByRole("link", { name: "Turnov Galerie" }).click();
  await expect(page).toHaveURL(
    /\/turnov-galerie;selectionProfile=13\/prehled$/,
  );

  await page.getByRole("link", { name: "Zpět na rozcestník" }).click();
  await expect(page).toHaveURL(/\/landing\/profil-rozcestnik\/13$/);

  await expect(page.getByLabel("Hledat organizaci")).toHaveValue("Galerie");
  await expect(
    page.getByLabel("Kategorie").locator("option:checked"),
  ).toHaveText("Nezařazeno");
  await expect(
    page.getByLabel("Zřizovatel").locator("option:checked"),
  ).toHaveText("Turnov 1");
  await expect(
    page.getByRole("link", { name: "Turnov Galerie" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Turnovská hospoda" }),
  ).toHaveCount(0);
});

test("offers a parent selection return only when one exists", async ({
  page,
}) => {
  await page.goto("/turnovska-hospoda/prehled");
  await expect(
    page.getByRole("link", { name: "Zpět na rozcestník" }),
  ).toHaveAttribute("href", "/landing/?selectionProfile=13");

  await page.goto("/magistrat/prehled");
  await expect(
    page.getByRole("link", { name: "Zpět na rozcestník" }),
  ).toHaveCount(0);
});
