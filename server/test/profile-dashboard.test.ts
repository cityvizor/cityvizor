jest.mock("../src/db", () => {
  const knex = jest.requireActual("knex");
  const { snakeCase } = jest.requireActual("change-case");

  return {
    db: knex({
      client: "pg",
      wrapIdentifier: (value, origImpl) => origImpl(snakeCase(value)),
    }),
  };
});

import { createProfileDashboardQuery } from "../src/routers/public/profile-dashboard";

describe("profile dashboard query", () => {
  it("reads accounting data only once", () => {
    const { sql } = createProfileDashboardQuery("42").toSQL();

    expect(sql.match(/from "data"\."accounting"/g)).toHaveLength(1);
  });
});
