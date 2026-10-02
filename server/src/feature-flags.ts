import { db } from "./db";
import { FeatureFlagRecord } from "./schema";

export async function getFeatureFlags(): Promise<Record<string, boolean>> {
  const flags = await db<FeatureFlagRecord>("app.feature_flags").select(
    "name",
    "enabled"
  );
  return Object.fromEntries(flags.map(flag => [flag.name, flag.enabled]));
}

export async function isFeatureEnabled(name: string): Promise<boolean> {
  const flag = await db<FeatureFlagRecord>("app.feature_flags")
    .select("enabled")
    .where({ name })
    .first();
  return flag?.enabled === true;
}
