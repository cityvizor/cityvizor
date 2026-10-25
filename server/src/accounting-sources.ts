import {
  EXCLUDE_INTERNAL_TRANSFERS_FEATURE,
  PRECOMPUTED_ACCOUNTING_SUMMARIES_FEATURE,
  getFeatureFlags,
} from "./feature-flags";
import { db } from "./db";
import { ProfileRecord } from "./schema";

export interface AccountingSources {
  accounting: string;
  yearSummaries: string;
  groupSummaries: string;
  usePrecomputedSummaries: boolean;
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

  return excludeInternalTransfers
    ? {
        accounting: "accounting_without_internal_transfers",
        yearSummaries: "accounting_year_summaries_without_internal_transfers",
        groupSummaries: "accounting_group_summaries_without_internal_transfers",
        usePrecomputedSummaries,
      }
    : {
        accounting: "accounting",
        yearSummaries: "data.accounting_year_summaries",
        groupSummaries: "data.accounting_group_summaries",
        usePrecomputedSummaries,
      };
}
