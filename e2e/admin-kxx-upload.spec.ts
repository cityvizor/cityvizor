import { expect, Page, test } from "@playwright/test";

async function openUpload(page: Page, fail = false) {
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
    (token) => localStorage.setItem("id_token", token),
    token,
  );
  const requests: { path: string; method: string; body: string }[] = [];
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path.startsWith("/api/import/")) {
      requests.push({
        path,
        method: request.method(),
        body: request.postDataBuffer()?.toString() ?? "",
      });
      await route.fulfill({
        status: fail ? 500 : 200,
        json: { id: 1, status: "pending" },
      });
    } else if (path === "/api/admin/profiles/45") {
      await route.fulfill({
        json: {
          id: 45,
          name: "Testovací obec",
          type: "municipality",
          status: "visible",
          url: "test",
          sumMode: "complete",
        },
      });
    } else if (path === "/api/admin/profiles/45/years") {
      await route.fulfill({
        json: [{ year: 2026, hidden: false, validity: "2026-08-31" }],
      });
    } else {
      await route.fulfill({ json: [] });
    }
  });
  await page.goto("/admin/profily/45/data");
  await page.getByRole("button", { name: "Další", exact: true }).click();
  await page.getByText("Nahrát data", { exact: true }).click();
  await expect(page.locator("data-upload-modal")).toBeVisible();
  await page.locator('input[name="validity"]').fill("2026-08-31");
  return requests;
}
const file = (name: string, text = "test") => ({
  name,
  mimeType: "application/octet-stream",
  buffer: Buffer.from(text),
});

test("uploads a KXX pair and the shared CSV dictionary without sending hidden CSV files", async ({
  page,
}) => {
  const requests = await openUpload(page);
  await page.locator('input[name="dataFile"]').setInputFiles(file("old.csv"));
  await page.locator("#import-format").selectOption("kxx");
  await expect(page.locator('input[name="dataFile"]')).toBeHidden();
  await expect(page.locator('input[name="eventsFile"]')).toBeVisible();
  const submit = page.locator('data-upload-modal button[type="submit"]');
  await expect(submit).toBeDisabled();
  await page
    .locator("#kxx-accounting")
    .setInputFiles(file("ucto.kxx", "ucto contents"));
  await expect(submit).toBeDisabled();
  await page
    .locator("#kxx-budget")
    .setInputFiles(file("rozp.kxx", "rozp contents"));
  await page
    .locator('input[name="eventsFile"]')
    .setInputFiles(file("events.csv", "id;name\n161;Akce"));
  // Missing dictionary mode must not start even the KXX request.
  await submit.click();
  await expect(page.locator("data-upload-modal")).toBeVisible();
  expect(requests).toHaveLength(0);
  await page.locator('select[name="eventsFileMode"]').selectOption("overwrite");
  await submit.click();
  await expect(page.locator("data-upload-modal")).toBeHidden();
  expect(requests).toHaveLength(2);
  const kxx = requests.find((request) => request.path.endsWith("/ginis-kxx"))!;
  expect(kxx.method).toBe("POST");
  expect(kxx.body).toContain('name="accounting"; filename="ucto.kxx"');
  expect(kxx.body).toContain('name="budget"; filename="rozp.kxx"');
  expect(kxx.body).toContain("2026-08-31");
  expect(kxx.body).not.toContain("old.csv");
  expect(
    requests.some((request) => request.path.endsWith("/events")),
  ).toBeTruthy();
});

test("keeps CSV upload working after switching back and keeps the dialog open on failure", async ({
  page,
}) => {
  const requests = await openUpload(page, true);
  await page.locator("#import-format").selectOption("kxx");
  await page.locator("#kxx-accounting").setInputFiles(file("ucto.kxx"));
  await page.locator("#kxx-budget").setInputFiles(file("rozp.kxx"));
  await page.locator("#import-format").selectOption("csv");
  await expect(page.locator("#kxx-accounting")).toBeHidden();
  await page.locator('input[name="dataFile"]').setInputFiles(file("data.csv"));
  await page.locator('select[name="dataFileMode"]').selectOption("overwrite");
  await page.locator('data-upload-modal button[type="submit"]').click();
  await expect(
    page.getByText(
      "Některé soubory se nepodařilo nahrát. Zkontrolujte historii importů před dalším pokusem.",
    ),
  ).toBeVisible();
  await expect(page.locator("data-upload-modal")).toBeVisible();
  expect(requests).toHaveLength(1);
  expect(requests[0].path).toBe("/api/import/profiles/45/data");
});
