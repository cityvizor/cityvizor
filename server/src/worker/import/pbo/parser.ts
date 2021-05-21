import {Transform} from 'stream';
import csvparse from 'csv-parse';
import {PlanRecord} from '../../../schema/database/plan';
import {Import} from '../import';

const mandatoryHeaders: string[] = ['type', 'sa', 'aa', 'amount'];

export function createCsvParser(): Transform {
  return csvparse({
    delimiter: ';',
    columns: (line: string[]) => {
      const missingHeaders = mandatoryHeaders.filter(
        header => !line.includes(header)
      );
      if (missingHeaders.length !== 0) {
        throw Error(
          `Failed to find these mandatory headers: ${missingHeaders.join(' ')}`
        );
      }
      return line.map(header =>
        mandatoryHeaders.includes(header) ? header : false
      );
    },
    relax_column_count: true,
  });
}

export function createPboParser(options: Import.Options): Transform {
  return new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(line, enc, callback) {
      // Sanity check, are we getting numbers?
      let err: Error | null = null;
      ['sa', 'aa', 'amount'].forEach(field => {
        if (isNaN(Number(line[field]))) {
          err = new Error(`Field ${field} of value "${
            line[field]
          }" is not a number.
                    Parsed line: ${JSON.stringify(line)}`);
        }
      });

      if (err) {
        callback(err);
      } else {
        const planRecord: PlanRecord = {
          profileId: options.profileId,
          year: options.year,
          type: line.type,
          sa: line.sa,
          aa: line.aa,
          amount: line.amount,
        };
        this.push(planRecord);
        callback();
      }
    },
  });
}
