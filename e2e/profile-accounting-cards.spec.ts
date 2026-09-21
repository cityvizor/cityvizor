import { expect, Page, test } from "@playwright/test";

const profile = "e2e-obec";
const profileId = 501;
const year = 2018;
const groups = [
  ["10", 1_200_000, 1_000_000],
  ["20", 760_000, 800_000],
  ["30", 510_000, 600_000],
  ["40", 320_000, 400_000],
  ["50", 190_000, 250_000],
  ["60", 75_000, 100_000],
] as const;

function amounts(income: boolean, amount: number, budgetAmount: number) {
  return {
    expenditureAmount: income ? 0 : amount,
    budgetExpenditureAmount: income ? 0 : budgetAmount,
    incomeAmount: income ? amount : 0,
    budgetIncomeAmount: income ? budgetAmount : 0,
  };
}

function events(income: boolean) {
  return [
    {
      id: 1,
      name: "Souhrnná akce",
      ...amounts(income, 1_200_000, 1_000_000),
      items: [
        { id: 101, ...amounts(income, 800_000, 700_000) },
        { id: null, ...amounts(income, 400_000, 300_000) },
      ],
    },
    {
      id: 2,
      name: "Celková akce",
      ...amounts(income, 50_000, 75_000),
      items: [{ id: null, ...amounts(income, 50_000, 75_000) }],
    },
  ];
}

async function mockApi(page: Page) {
  await page.route("**/api/public/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    const groupMatch = path.match(
      /\/groups\/(paragraph|item)(?:\/[^/]+\/events)?$/,
    );
    let json: unknown;

    if (path === `/api/public/profiles/${profile}`) {
      json = {
        id: profileId,
        status: "visible",
        sumMode: "complete",
        type: "municipality",
        url: profile,
        name: "E2E obec",
        hasPayments: false,
      };
    } else if (path === `/api/public/profiles/${profileId}/years`) {
      json = [
        {
          year,
          incomeAmount: 3_055_000,
          budgetIncomeAmount: 3_150_000,
          expenditureAmount: 3_055_000,
          budgetExpenditureAmount: 3_150_000,
        },
      ];
    } else if (path.endsWith("/codelists/items")) {
      json = [{ id: "101", name: "Pojmenovaná položka" }];
    } else if (path.endsWith("-groups")) {
      const income = path.includes("item-groups");
      json = groups.map(([id]) => ({
        id,
        name: `${income ? "Příjmová" : "Výdajová"} skupina ${id}`,
      }));
    } else if (groupMatch) {
      const income = groupMatch[1] === "item";
      if (path.endsWith("/events")) json = events(income);
      else {
        if (!income) await new Promise((resolve) => setTimeout(resolve, 250));
        json = groups.map(([id, amount, budget]) => ({
          id,
          ...amounts(income, amount, budget),
        }));
      }
    } else {
      await route.fulfill({ status: 404, json: {} });
      return;
    }

    await route.fulfill({ json });
  });
}

test.beforeEach(async ({ page }) => mockApi(page));

test("changes overview modes and resets the default", async ({ page }) => {
  await page.goto(`/${profile}/hospodareni/vydaje;rok=${year}`);
  const select = page.getByRole("combobox", { name: "Zobrazení přehledu" });

  await expect(select).toHaveValue("chart");

  for (const value of ["cards", "map", "bars"] as const) {
    await select.selectOption(value);
    await expect(select).toHaveValue(value);
    await expect(page.locator(".group-card")).toHaveCount(groups.length);
  }

  await page.reload();
  await expect(select).toHaveValue("chart");
});

test("shows the correct income amounts and meaning", async ({ page }) => {
  await page.goto(`/${profile}/hospodareni/prijmy;rok=${year}`);
  const select = page.getByRole("combobox", { name: "Zobrazení přehledu" });

  await select.selectOption("cards");
  const firstCard = page.locator(".group-card:not(:disabled)").first();
  await expect(firstCard).toContainText("1 200 000 Kč");
  await expect(firstCard).toContainText("1 000 000 Kč");
  await firstCard.click();
  const detail = page.locator("#selectedGroup");

  await expect(
    detail.getByText("1 200 000 Kč", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    detail.getByText("1 000 000 Kč", { exact: true }).first(),
  ).toBeVisible();
  await expect(detail.getByText(/Nad rozpočet o/).first()).toContainText(
    "200 000 Kč",
  );
  await expect(detail.getByText(/Překročeno o/)).toHaveCount(0);
});

test("ignores a late response for the previous accounting type", async ({
  page,
}) => {
  const oldResponse = page.waitForResponse((response) =>
    response.url().includes(`/accounting/${year}/groups/paragraph`),
  );

  await page.goto(`/${profile}/hospodareni/vydaje;rok=${year}`);
  await page.locator(`a[href="/${profile}/hospodareni/prijmy"]`).click();
  await oldResponse;
  await page
    .getByRole("combobox", { name: "Zobrazení přehledu" })
    .selectOption("cards");

  const overview = page.locator(".group-cards");
  await expect(overview.getByText("Příjmová skupina 10")).toBeVisible();
  await expect(overview.getByText(/Výdajová skupina/)).toHaveCount(0);
});

test("selects, switches and clears a card detail", async ({ page }) => {
  await page.goto(`/${profile}/hospodareni/vydaje;rok=${year}`);
  await page
    .getByRole("combobox", { name: "Zobrazení přehledu" })
    .selectOption("cards");

  const cards = page.locator(".group-card:not(:disabled)");
  const first = cards.last();
  const second = cards.nth(4);
  const detail = page.locator("#selectedGroup");

  await first.click();
  await expect(page).toHaveURL(/;skupina=/);
  await expect(first).toHaveAttribute("aria-pressed", "true");
  await expect(detail).toBeInViewport();

  await second.click();
  await expect(second).toHaveAttribute("aria-pressed", "true");
  await expect(first).toHaveAttribute("aria-pressed", "false");
  await expect(detail).toBeInViewport();

  await second.click();
  await expect(page).not.toHaveURL(/;skupina=/);
  await expect(detail).toBeHidden();
});
