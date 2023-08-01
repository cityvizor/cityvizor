import {Transform} from 'stream';
import csvparse from 'csv-parse';
import {PlanRecord} from '../../../schema/database/plan';
import {Import} from '../import';
import {AaNameRecord} from '../../../schema/database/aaName';

// Headers/columns that must be present in the csv
const mandatoryPlanHeaders: string[] = ['type', 'sa', 'aa', 'amount'];
const mandatoryAaNamesHeaders: string[] = ['aa', 'sa', 'name'];

// Fields to be checked if they contain integers
const checkedPlanFields = ['sa', 'aa', 'amount'];
const checkedAaNamesFields = ['aa'];

const isPlan = (format: Import.Format): boolean => format !== 'pbo_aa_names';
const getMandatoryHeaders = (options: Import.Options): string[] =>
  isPlan(options.format) ? mandatoryPlanHeaders : mandatoryAaNamesHeaders;
const getCheckedHeaders = (options: Import.Options): string[] =>
  isPlan(options.format) ? checkedPlanFields : checkedAaNamesFields;

export function createCsvParser(options: Import.Options): Transform {
  return csvparse({
    delimiter: ';',
    columns: (line: string[]) => {
      const missingHeaders = getMandatoryHeaders(options).filter(
        header => !line.includes(header)
      );
      if (missingHeaders.length !== 0) {
        throw Error(
          `Failed to find these mandatory headers: ${missingHeaders.join(' ')}`
        );
      }
      return line.map(header =>
        getMandatoryHeaders(options).includes(header) ? header : false
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
      getCheckedHeaders(options).forEach(field => {
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
        if (isPlan(options.format)) {
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
        } else {
          const aaNameRecord: AaNameRecord = {
            profileId: options.profileId,
            year: options.year,

            aa: line.aa,
            sa: line.sa,
            name: line.name,
          };
          this.push(aaNameRecord);
          callback();
        }
      }
    },
  });
}
