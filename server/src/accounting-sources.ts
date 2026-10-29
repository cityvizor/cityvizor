import { Knex } from "knex";
import { accountingRules } from "./accounting-rules";
import {
  EXCLUDE_INTERNAL_TRANSFERS_FEATURE,
  PRECOMPUTED_ACCOUNTING_SUMMARIES_FEATURE,
  getFeatureFlags,
} from "./feature-flags";
import { db } from "./db";
import { ProfileRecord } from "./schema";

export type AccountingSource = (alias?: string) => Knex.QueryBuilder;

export interface AccountingSources {
  accounting: AccountingSource;
  yearSummaries: AccountingSource;
  groupSummaries: AccountingSource;
  usePrecomputedSummaries: boolean;
}

/** Each call builds a fresh query, also usable as an aliased subquery in joins. */
function createSource(
  table: string,
  columns?: (string | Knex.Raw)[]
): AccountingSource {
  return alias =>
    columns
      ? db.from(
          db(table)
            .select(columns)
            .as(alias ?? "amounts")
        )
      : db(alias ? { [alias]: table } : table);
}

function accountingColumns(): (string | Knex.Raw)[] {
  return [
    "profileId",
    "year",
    "type",
    "paragraph",
    "item",
    "unit",
    "event",
    ...(["income", "expenditure"] as const).flatMap(side =>
      ["", "budget_"].map(prefix => {
        const column = `${prefix}${side}_amount`;
        return db.raw(
          "CASE WHEN item = ANY(?::integer[]) THEN 0::numeric ELSE ?? END AS ??",
          [accountingRules.internalTransfers[`${side}Items`], column, column]
        );
      })
    ),
    "financingAmount",
    "budgetFinancingAmount",
  ];
}

function summaryColumns(level: "year" | "group"): (string | Knex.Raw)[] {
  return [
    "profileId",
    "year",
    ...(level === "group" ? ["field", "groupId"] : []),
    ...["income", "expenditure"].flatMap(side =>
      ["actual", "budget"].map(prefix => {
        const column = `${prefix}_${side}_amount`;
        return db.raw("?? - ?? AS ??", [
          column,
          `${prefix}_internal_transfer_${side}_amount`,
          column,
        ]);
      })
    ),
    "actualFinancingAmount",
    "budgetFinancingAmount",
    "computedAt",
  ];
}

/** Resolve once per request so every amount in the response uses the same mode. */
export async function getAccountingSources(
  profileId: string | number
): Promise<AccountingSources> {
  const flags = await getFeatureFlags();
  const featureEnabled = flags[EXCLUDE_INTERNAL_TRANSFERS_FEATURE] === true;
  const usePrecomputedSummaries =
    flags[PRECOMPUTED_ACCOUNTING_SUMMARIES_FEATURE] === true;
  const profile = featureEnabled
    ? await db<ProfileRecord>("app.profiles")
        .select("type", "excludeInternalTransfers")
        .where("id", profileId)
        .first()
    : undefined;
  const excludeInternalTransfers =
    profile?.type === "municipality" &&
    profile.excludeInternalTransfers === true;

  return {
    accounting: createSource(
      "accounting",
      excludeInternalTransfers ? accountingColumns() : undefined
    ),
    yearSummaries: createSource(
      "data.accounting_year_summaries",
      excludeInternalTransfers ? summaryColumns("year") : undefined
    ),
    groupSummaries: createSource(
      "data.accounting_group_summaries",
      excludeInternalTransfers ? summaryColumns("group") : undefined
    ),
    usePrecomputedSummaries,
  };
}
