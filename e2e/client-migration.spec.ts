import { expect, test } from "@playwright/test";

const profiles = [
  { id: 45, name: "Beta", type: "municipality", parent: null },
  { id: 46, name: "Alfa", type: "pbo", parent: 45 },
  { id: 47, name: "Gama", type: "external", parent: 45 },
];
const users = [
  { id: 1, name: "Beta", role: "admin" },
  { id: 2, name: "Alfa", role: "profile-admin" },
];

function jwt(login = "test", role = "admin") {
  const claims = {
    id: 1,
    login,
    roles: [role],
    managedProfiles: [45],
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  return `e30.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.test`;
}

test.beforeEach(async ({ page }) => {
  let loginAttempt = 0;
  const data = {
    "/api/admin/users": users,
    "/api/admin/profiles": profiles,
    "/api/public/profiles": profiles,
    "/api/admin/profiles/45": profiles[0],
  };
  await page.route("**/api/**", route => {
    const path = new URL(route.request().url()).pathname;
    return path === "/api/account/login"
      ? route.fulfill({ status: ++loginAttempt === 1 ? 401 : 500, body: "" })
      : route.fulfill({ json: data[path] ?? [] });
  });
});

test("login errors and timed toasts update without another click", async ({
  page,
}) => {
  await page.goto("/login");
  await page.locator('[name="username"]').fill("test");
  await page.locator('[name="password"]').fill("wrong");
  await page.locator('input[type="submit"]').click();
  await expect(
    page.getByText("Chybná emailová adresa nebo heslo."),
  ).toBeVisible();
  await page.locator('input[type="submit"]').click();
  const toast = page.getByText(
    "Neznámá chyba při přihlášení, prosím kontaktujte správce.",
  );
  await expect(toast).toBeVisible();
  await expect(toast).toHaveCount(0);
});

test("token renewal redraws login and role", async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(
    token => localStorage.setItem("id_token", token),
    jwt("puvodni"),
  );
  await page.route("**/api/account/login/renew", route =>
    route.fulfill({ body: jwt("obnoveny", "profile-admin") }),
  );
  await page.goto("/admin/profily");
  await expect(page.locator("footer")).toContainText("puvodni");
  const usersLink = page.locator('a[href="/admin/spravci"]');
  await expect(usersLink).toBeVisible();
  await page.clock.fastForward(30 * 60 * 1000);
  await expect(page.locator("footer")).toContainText("obnoveny");
  await expect(usersLink).toHaveCount(0);
});

test("event detail survives a failed history request", async ({ page }) => {
  const amounts = {
    expenditureAmount: 100,
    budgetExpenditureAmount: 200,
    incomeAmount: 0,
    budgetIncomeAmount: 0,
  };
  let releaseEvent!: () => void;
  let releaseHistory!: () => void;
  const eventReady = new Promise<void>(resolve => (releaseEvent = resolve));
  const historyReady = new Promise<void>(resolve => (releaseHistory = resolve));
  await page.route("**/api/public/profiles/e2e-obec", route =>
    route.fulfill({
      json: {
        ...profiles[0],
        url: "e2e-obec",
        status: "visible",
        sumMode: "complete",
      },
    }),
  );
  await page.route("**/api/public/profiles/45/years", route =>
    route.fulfill({ json: [{ year: 2025, ...amounts }] }),
  );
  await page.route("**/api/public/profiles/45/events/2025/1", async route => {
    await eventReady;
    await route.fulfill({
      json: {
        id: 1,
        name: "Testovací akce",
        ...amounts,
      },
    });
  });
  await page.route(
    "**/api/public/profiles/45/events/history/1",
    async route => {
      await historyReady;
      await route.fulfill({ status: 500, body: "" });
    },
  );
  const codelistsLoaded = page.waitForResponse(response =>
    response.url().includes("/codelists/paragraphs"),
  );
  await page.goto("/e2e-obec/hospodareni/vydaje;rok=2025;akce=1");
  await codelistsLoaded;
  await page.evaluate(
    () =>
      new Promise(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  releaseEvent();
  const heading = page.locator("event-detail-modal h2");
  try {
    await expect(heading).toHaveText("Testovací akce (2025)");
  } finally {
    releaseHistory();
  }
  await expect(
    page.getByText("Nepodařilo se načíst historii akce."),
  ).toBeVisible();
  await expect(heading).toBeVisible();
});

for (const [path, name, field, count, descending] of [
  ["/admin/spravci", "Správci", "Jméno", 2, "Beta"],
  ["/admin/profily", "Profily", "Název", 3, "Gama"],
  ["/admin/profily/45/podprofily", "Podprofily", "Název", 2, "Gama"],
] as const) {
  test(`${name}: asynchronous rows, sorting and filters`, async ({ page }) => {
    await page.addInitScript(
      token => localStorage.setItem("id_token", token),
      jwt(),
    );
    await page.goto(path);
    const table = page.getByRole("table", { name, exact: true });
    const rows = table.locator("tbody tr");
    await expect(rows).toHaveCount(count);
    await page
      .getByRole("button", { name: `Seřadit podle: ${field}`, exact: true })
      .click();
    await expect(rows.first()).toContainText(descending);
    await page
      .getByRole("textbox", { name: `Filtrovat: ${field}`, exact: true })
      .fill("Alfa");
    await expect(rows).toHaveCount(1);
  });
}
