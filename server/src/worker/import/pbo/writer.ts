import {PlanRecord} from '../../../schema/database/plan';
import {Import} from '../import';
import {Writable} from 'stream';
import logger from '../logger';
import {db} from '../../../db';

export class DatabaseWriter extends Writable {
  planCount = 0;

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
        this.planCount += chunks.length;
      }
      callback();
    } catch (err) {
      callback(err);
    }
  }

  _final(callback) {
    logger.log(`Written ${this.planCount} plan records to the DB.`);
    callback();
  }

  async writePlans(plans: PlanRecord[]) {
    await db<PlanRecord>('data.pbo_plans')
      .insert(plans)
      .transacting(this.options.transaction);
  }
}
