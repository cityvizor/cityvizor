import { expect, Page, test } from "@playwright/test";

const label = "Nezahrnovat převody mezi vlastními účty a fondy do součtů";
const note =
  "Rozpočet a skutečnost nezahrnují převody mezi vlastními účty a fondy.";

async function mockApi(
  page: Page,
  featureEnabled: boolean,
  excludeInternalTransfers = false,
  type = "municipality",
) {
  const token = [
    Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
      "base64url",
    ),
    Buffer.from(
      JSON.stringify({
        id: 1,
        roles: ["admin"],
        managedProfiles: [45],
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    ).toString("base64url"),
    "test",
  ].join(".");
  await page.addInitScript(
    (value) => localStorage.setItem("id_token", value),
    token,
  );
  const profile = {
    id: 45,
    name: "Testovací obec",
    url: "test-obec",
    type,
    status: "visible",
    sumMode: "complete",
    parent: null,
    sectionId: 1,
    excludeInternalTransfers,
    hasPayments: false,
  };
  const patches: Record<string, unknown>[] = [];
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path === "/api/public/features") {
      await route.fulfill({
        json: { "exclude-internal-transfers": featureEnabled },
      });
    } else if (path === "/api/admin/profiles/45") {
      if (request.method() === "PATCH") {
        const body = request.postDataJSON();
        patches.push(body);
        Object.assign(profile, body);
        await route.fulfill({ status: 204 });
      } else await route.fulfill({ json: profile });
    } else if (path === "/api/public/profiles") {
      await route.fulfill({ json: [profile] });
    } else if (path === "/api/public/profiles/test-obec") {
      await route.fulfill({ json: profile });
    } else if (path === "/api/admin/sections") {
      await route.fulfill({ json: [{ sectionId: 1, csName: "Obce" }] });
    } else {
      await route.fulfill({ json: [] });
    }
  });
  return patches;
}

test("places the opt-in below sum mode and persists enabling and disabling", async ({
  page,
}) => {
  const patches = await mockApi(page, true);
  await page.goto("/admin/profily/45/nastaveni");
  const toggle = page.getByRole("switch", { name: label });
  await expect(toggle).toBeVisible();
  await expect(toggle).not.toBeChecked();
  const sumMode = await page.locator('select[name="sum_mode"]').boundingBox();
  const toggleBox = await toggle.boundingBox();
  expect(toggleBox!.y).toBeGreaterThan(sumMode!.y);
  await toggle.check();
  await page.getByRole("button", { name: "Uložit", exact: true }).click();
  await expect.poll(() => patches.length).toBe(1);
  expect(patches[0].excludeInternalTransfers).toBe(true);
  await page.reload();
  await expect(toggle).toBeChecked();
  await toggle.uncheck();
  await page.getByRole("button", { name: "Uložit", exact: true }).click();
  await expect.poll(() => patches.length).toBe(2);
  expect(patches[1].excludeInternalTransfers).toBe(false);
  await page.reload();
  await expect(toggle).not.toBeChecked();
  await toggle.scrollIntoViewIfNeeded();
  await page.screenshot({
    path: "/tmp/cityvizor-profile-internal-transfers-settings.png",
    fullPage: true,
  });
});

test("hides the setting behind the flag and preserves a stored choice on other edits", async ({
  page,
}) => {
  const patches = await mockApi(page, false, true);
  await page.goto("/admin/profily/45/nastaveni");
  await expect(page.getByRole("switch", { name: label })).toHaveCount(0);
  await page.getByRole("button", { name: "Uložit", exact: true }).click();
  await expect.poll(() => patches.length).toBe(1);
  expect(patches[0]).not.toHaveProperty("excludeInternalTransfers");
});

test("does not offer municipality consolidation for a PBO", async ({
  page,
}) => {
  await mockApi(page, true, true, "pbo");
  await page.goto("/admin/profily/45/nastaveni");
  await expect(page.locator('select[name="sum_mode"]')).toBeVisible();
  await expect(page.getByRole("switch", { name: label })).toHaveCount(0);
});

for (const [featureEnabled, profileEnabled] of [
  [false, true],
  [true, false],
  [true, true],
]) {
  test(`shows the public note only when both gates are enabled: ${featureEnabled}/${profileEnabled}`, async ({
    page,
  }) => {
    await mockApi(page, featureEnabled, profileEnabled);
    await page.goto("/test-obec/prehled");
    if (featureEnabled && profileEnabled)
      await expect(page.getByText(note)).toBeVisible();
    else {
      await expect(
        page.getByRole("heading", { name: "Testovací obec" }),
      ).toBeVisible();
      await expect(page.getByText(note)).toHaveCount(0);
    }
  });
}
