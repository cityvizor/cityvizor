import { db } from "../src/db";
import { getFeatureFlags, isFeatureEnabled } from "../src/feature-flags";

jest.mock("../src/db", () => ({ db: jest.fn() }));

it("returns flags as a map", async () => {
  (db as unknown as jest.Mock).mockReturnValue({
    select: jest.fn().mockResolvedValue([
      { name: "enabled", enabled: true },
      { name: "disabled", enabled: false },
    ]),
  });

  await expect(getFeatureFlags()).resolves.toEqual({
    enabled: true,
    disabled: false,
  });
});

it.each([
  [{ enabled: true }, true],
  [{ enabled: false }, false],
  [undefined, false],
])("returns %s as %s", async (row, expected) => {
  const query = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn().mockResolvedValue(row),
  };
  (db as unknown as jest.Mock).mockReturnValue(query);

  await expect(isFeatureEnabled("feature")).resolves.toBe(expected);
});
