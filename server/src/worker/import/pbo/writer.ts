import {PlanRecord} from '../../../schema/database/plan';
import {Import} from '../import';
import {Writable} from 'stream';
import logger from '../logger';
import {db} from '../../../db';

export class DatabaseWriter extends Writable {
  count = 0;

  constructor(private options: Import.Options) {
    super({
      objectMode: true,
    });
  }

  async _writev(
    chunks: {chunk: PlanRecord; encoding: string}[],
    callback: (err?: Error) => void
  ) {
    try {
      if (chunks.length) {
        await this.writePlans(chunks.map(chunk => chunk.chunk));
        this.count += chunks.length;
      }
      callback();
    } catch (err) {
      callback(err);
    }
  }

  _final(callback) {
    logger.log(`Written ${this.count} plan records to the DB.`);
    callback();
  }

  async writePlans(plans: PlanRecord[]) {
    if (this.options.format === 'pbo_expected_plan') {
      await db<PlanRecord>('data.pbo_expected_plans')
        .insert(plans)
        .transacting(this.options.transaction);
    } else if (this.options.format === 'pbo_real_plan') {
      await db<PlanRecord>('data.pbo_real_plans')
        .insert(plans)
        .transacting(this.options.transaction);
    } else {
      throw new Error(`Unsupported format: ${this.options.format}`);
    }
  }
}
