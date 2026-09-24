import { expect, Page, test } from "@playwright/test";

const profile = "e2e-financovani";
const profileId = 502;

async function mockApi(
  page: Page,
  financingToggleEnabled: boolean,
  financingAmount = 300,
) {
  await page.route("**/api/public/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    let json: unknown;

    if (path === "/api/public/features") {
      json = {
        "dashboard-financing-toggle": financingToggleEnabled,
      };
    } else if (path === `/api/public/profiles/${profile}`) {
      json = {
        id: profileId,
        status: "visible",
        sumMode: "complete",
        type: "municipality",
        url: profile,
        name: "E2E obec s financováním",
        hasPayments: false,
      };
    } else if (path === `/api/public/profiles/${profileId}/years`) {
      json = [
        {
          year: 2025,
          incomeAmount: 1_000 + financingAmount,
          budgetIncomeAmount: 1_000 + financingAmount * 2,
          incomeWithoutFinancingAmount: 1_000,
          budgetIncomeWithoutFinancingAmount: 1_000,
          financingAmount,
          budgetFinancingAmount: financingAmount * 2,
          expenditureAmount: 900,
          budgetExpenditureAmount: 1_100,
        },
      ];
    } else if (path === `/api/public/profiles/${profileId}/dashboard`) {
      json = [];
    } else if (
      path === `/api/public/profiles/${profileId}/payments` ||
      path === `/api/public/profiles/${profileId}/contracts`
    ) {
      json = [];
    } else {
      await route.fulfill({ status: 404, json: {} });
      return;
    }

    await route.fulfill({ json });
  });
}

test("keeps the financing control hidden when its feature flag is disabled", async ({
  page,
}) => {
  await mockApi(page, false);
  await page.goto(`/${profile}/prehled`);

  await expect(
    page.getByRole("switch", { name: "Zahrnout financování do příjmů" }),
  ).toHaveCount(0);
  await expect(page.getByTestId("budget-income-actual")).toContainText(
    "1 300 Kč",
  );
});

test("keeps the financing control hidden when the profile has no financing", async ({
  page,
}) => {
  await mockApi(page, true, 0);
  await page.goto(`/${profile}/prehled`);

  await expect(
    page.getByRole("switch", { name: "Zahrnout financování do příjmů" }),
  ).toHaveCount(0);
});

test("excludes financing from dashboard incomes and preserves the choice in URL", async ({
  page,
}) => {
  await mockApi(page, true);
  await page.setViewportSize({ width: 1280, height: 400 });
  await page.goto(`/${profile}/prehled`);

  const toggle = page.getByRole("switch", {
    name: "Zahrnout financování do příjmů",
  });
  await expect(toggle).toBeChecked();
  await expect(page.getByTestId("budget-income-planned")).toContainText(
    "1 600 Kč",
  );
  await expect(page.getByTestId("budget-income-actual")).toContainText(
    "1 300 Kč",
  );

  await toggle.scrollIntoViewIfNeeded();
  const scrollPosition = await page.evaluate(() => window.scrollY);
  expect(scrollPosition).toBeGreaterThan(0);

  await toggle.uncheck();

  await expect(page).toHaveURL(/financovani=ne/);
  await expect
    .poll(async () =>
      Math.abs((await page.evaluate(() => window.scrollY)) - scrollPosition),
    )
    .toBeLessThanOrEqual(1);
  await expect(page.getByTestId("budget-income-planned")).toContainText(
    "1 000 Kč",
  );
  await expect(page.getByTestId("budget-income-actual")).toContainText(
    "1 000 Kč",
  );

  await page.reload();
  await expect(toggle).not.toBeChecked();
  await expect(page.getByTestId("budget-income-actual")).toContainText(
    "1 000 Kč",
  );
});
