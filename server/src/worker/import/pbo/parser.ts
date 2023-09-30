import { Transform } from 'stream';
import csvparse from 'csv-parse';
import { PlanRecord } from '../../../schema/database/plan';
import { Import } from '../import';
import { AaNameRecord } from '../../../schema/database/aaName';

type Row = {
  type: string;
  sa: number;
  aa: number;
  amount: number;
  name: string;
};

type ColumnName = keyof Row;

const columnAliases: Record<ColumnName, string[]> = {
  type: [],
  sa: ['su'],
  aa: ['au'],
  amount: [],
  name: [],
};

// Headers/columns that must be present in the csv
const mandatoryPlanColumns: ColumnName[] = ['type', 'sa', 'aa', 'amount'];
const mandatoryAaNamesColumns: ColumnName[] = ['aa', 'sa', 'name'];

// Fields to be checked if they contain integers
const checkedPlanFields: ColumnName[] = ['sa', 'aa', 'amount'];
const checkedAaNamesFields: ColumnName[] = ['aa'];

const isPlan = (format: Import.Format): boolean => format !== 'pbo_aa_names';

const getMandatoryColumns = (options: Import.Options): ColumnName[] =>
  isPlan(options.format) ? mandatoryPlanColumns : mandatoryAaNamesColumns;

const getCheckedColumns = (options: Import.Options): ColumnName[] =>
  isPlan(options.format) ? checkedPlanFields : checkedAaNamesFields;

/** Resolves a column name found in the CSV file to its main name
 * (i.e. the alias used later by the row transformer).
 */
function resolveColumnAlias(alias: string): ColumnName | null {
  if (columnAliases[alias]) {
    // This is already the main column name.
    return alias as ColumnName;
  } else {
    // Try to find the column name for which this is declared as alias.
    return (
      (Object.keys(columnAliases).find(mainName =>
        columnAliases[mainName].includes(alias)
      ) as ColumnName) ?? null // This is not a known column name.
    );
  }
}

function mapHeaderColumns(
  header: string[],
  options: Import.Options
): (ColumnName | false)[] {
  const missingColumns = getMandatoryColumns(options).filter(
    requiredColumn =>
      !(
        header.includes(requiredColumn) ||
        columnAliases[requiredColumn].some(alias => header.includes(alias))
      )
  );

  if (missingColumns.length !== 0) {
    throw Error(
      `Failed to find these mandatory columns: ${missingColumns.join(', ')}`
    );
  }

  return header.map(column => resolveColumnAlias(column) ?? false);
}

export function createCsvParser(options: Import.Options): Transform {
  return csvparse({
    delimiter: ';',
    columns: header => mapHeaderColumns(header, options),
    relax_column_count: true,
  });
}

export function createPboParser(options: Import.Options): Transform {
  return new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(row: Row, enc, callback) {
      // Sanity check, are we getting numbers?
      let err: Error | null = null;
      getCheckedColumns(options).forEach(field => {
        if (isNaN(Number(row[field]))) {
          err = new Error(`Field ${field} of value "${row[field]
            }" is not a number.
                    Parsed line: ${JSON.stringify(row)}`);
        }
      });

      if (err) {
        callback(err);
      } else {
        if (isPlan(options.format)) {
          const planRecord: PlanRecord = {
            profileId: options.profileId,
            year: options.year,
            type: row.type,
            sa: row.sa,
            aa: row.aa,
            amount: row.amount,
          };
          this.push(planRecord);
          callback();
        } else {
          const aaNameRecord: AaNameRecord = {
            profileId: options.profileId,
            year: options.year,

            aa: row.aa,
            sa: row.sa,
            name: row.name,
          };
          this.push(aaNameRecord);
          callback();
        }
      }
    },
  });
}
