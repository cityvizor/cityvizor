import { PlanRecord } from "../../../schema/database/plan";
import { Import } from "../import";
import { Writable } from "stream";
import { db } from "../../../db";
import { AaNameRecord } from "../../../schema/database/aaName";
import { importLogger } from "../import-logger";

export class DatabaseWriter extends Writable {
  planCount = 0;
  aaNameCount = 0;

  constructor(private options: Import.Options) {
    super({
      objectMode: true,
    });
  }

  async _writev(
    chunks: { chunk: PlanRecord | AaNameRecord; encoding: string }[],
    callback: (err?: Error) => void
  ) {
    try {
      if (chunks.length) {
        if (this.options.format === "pbo_aa_names") {
          await this.writeAaNames(
            chunks.map(chunk => chunk.chunk as AaNameRecord)
          );
          this.aaNameCount += chunks.length;
          this.aaNameCount += chunks.length;
        } else if (
          this.options.format === "pbo_expected_plan" ||
          this.options.format === "pbo_real_plan"
        ) {
          await this.writePlans(chunks.map(chunk => chunk.chunk as PlanRecord));
          this.planCount += chunks.length;
        } else {
          throw new Error(`Unsupported format: ${this.options.format}`);
        }
      }
      callback();
    } catch (err) {
      if (err instanceof Error) {
        callback(err);
      }
    }
  }

  _final(callback) {
    if (this.planCount > 0)
      importLogger.log(`Written ${this.planCount} plan records to the DB.`);
    if (this.aaNameCount > 0)
      importLogger.log(
        `Written ${this.aaNameCount} analytic account name records to the DB.`
      );
    callback();
  }

  async writeAaNames(aaNames: AaNameRecord[]) {
    await db<AaNameRecord>("data.pbo_aa_names")
      .insert(aaNames)
      .transacting(this.options.transaction);
  }

  async writePlans(plans: PlanRecord[]) {
    if (this.options.format === "pbo_expected_plan") {
      await db<PlanRecord>("data.pbo_expected_plans")
        .insert(plans)
        .transacting(this.options.transaction);
    } else if (this.options.format === "pbo_real_plan") {
      await db<PlanRecord>("data.pbo_real_plans")
        .insert(plans)
        .transacting(this.options.transaction);
    } else {
      throw new Error(`Unsupported format: ${this.options.format}`);
    }
  }
}
