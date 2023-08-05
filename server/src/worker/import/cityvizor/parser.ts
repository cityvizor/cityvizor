import csvparse from 'csv-parse';
import {Transform} from 'stream';
import {Import} from '../import';
import logger from '../logger';
import {AccountingRecord, PaymentRecord, EventRecord} from '../../../schema';
import {ProfileType} from '../../../schema/profile-type';
import {CityvizorFileType} from './cityvizor-file-type';

type Row = Record<string, string | number>;

const headerAliases = {
  type: ['type', 'recordType', 'MODUL', 'DOKLAD_AGENDA'],
  paragraph: ['paragraph', 'PARAGRAF'],
  item: ['item', 'POLOZKA'],
  unit: ['unit', 'ORJ'],
  event: ['eventId', 'event', 'AKCE', 'ORG'],
  amount: ['amount', 'CASTKA'],
  date: ['date', 'DATUM', 'DOKLAD_DATUM'],
  counterpartyId: ['counterpartyId', 'SUBJEKT_IC'],
  counterpartyName: ['counterpartyName', 'SUBJEKT_NAZEV'],
  description: ['description', 'POZNAMKA'],
  id: ['id', 'eventId', 'srcId', 'AKCE', 'ORG'],
  name: ['name', 'eventName', 'AKCE_NAZEV'],
  su: ['su', 'sa'],
  au: ['au', 'aa'],
  // Used when parsing data exported from Cityvizor
  expenditureAmount: ['expenditureAmount'],
  budgetExpenditureAmount: ['budgetExpenditureAmount'],
  incomeAmount: ['incomeAmount'],
  budgetIncomeAmount: ['budgetIncomeAmount'],
};

function getMandatoryHeaders(
  fileType: CityvizorFileType,
  profileType: ProfileType
): string[][] {
  // Data exported from Cityvizor do not contain 'amount' column, but contain the other four columns
  const municipalityHeaders = [
    ['paragraph'],
    ['item'],
    [
      'amount',
      'expenditureAmount',
      'budgetExpenditureAmount',
      'incomeAmount',
      'budgetIncomeAmount',
    ],
  ];

  const pboHeaders = [
    ['item'],
    ['date'],
    [
      'amount',
      'expenditureAmount',
      'budgetExpenditureAmount',
      'incomeAmount',
      'budgetIncomeAmount',
    ],
  ];

  const eventHeaders = [['id'], ['name']];

  if (profileType === 'pbo') {
    switch (fileType) {
      case CityvizorFileType.ACCOUNTING:
      case CityvizorFileType.DATA:
      case CityvizorFileType.PAYMENTS:
        return pboHeaders;
      case CityvizorFileType.EVENTS:
        return eventHeaders;
    }
  } else {
    switch (fileType) {
      case CityvizorFileType.ACCOUNTING:
      case CityvizorFileType.DATA:
      case CityvizorFileType.PAYMENTS:
        return municipalityHeaders;
      case CityvizorFileType.EVENTS:
        return eventHeaders;
    }
  }
}

export function createCityvizorParser(
  fileType: CityvizorFileType,
  profileType: ProfileType
): csvparse.Parser {
  const headers: string[][] = getMandatoryHeaders(fileType, profileType);

  const parseHeader = (
    headerLine: string[],
    mandatoryHeaders: string[][]
  ): string[] => {
    // remove possible BOM at the beginning of file, also removes extra whitespaces
    headerLine = headerLine.map(item => item.trim());
    logger.log(
      `The header array being searched for field names: [${headerLine}]`
    );
    const foundHeaders: string[] = headerLine.map(originalField => {
      // browse through all the target fields if originalField is someones alias
      return Object.keys(headerAliases).find(
        key => headerAliases[key].indexOf(originalField) !== -1
      );
    }) as string[];
    logger.log(`Found headers: [${foundHeaders}]`);

    // Check if each group of mandatory headers has at least one member present in found headers
    mandatoryHeaders.forEach(mandatoryHeaderGroup => {
      if (
        mandatoryHeaderGroup.filter(header => foundHeaders.includes(header))
          .length === 0
      ) {
        throw Error(
          `Failed to find mandatory column header group [${mandatoryHeaderGroup}]`
        );
      }
    });
    return foundHeaders;
  };

  return csvparse({
    delimiter: ';',
    columns: line => parseHeader(line, headers),
    relax_column_count: true,
  });
}

export function createCityvizorTransformer(
  file: CityvizorFileType,
  options: Import.Options
): Transform {
  switch (file) {
    case CityvizorFileType.ACCOUNTING:
    case CityvizorFileType.DATA:
    case CityvizorFileType.PAYMENTS:
      return createDataTransformer(options);
    case CityvizorFileType.EVENTS:
      return createEventsTransformer(options);
  }
}

function createDataTransformer(options: Import.Options) {
  return new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(line, enc, callback) {
      const recordType = line.type;

      try {
        const accounting = createAccountingRecord(line, options);
        this.push({type: 'accounting', record: accounting});
        // TODO: Why does the paymentRecord have to be pushed twice, once as payment and once as accounting?
        // Answer: Due to the app's architecture and internal representation of the data. Weird, but let's roll with it
        if (recordType === 'KDF' || recordType === 'KOF') {
          const payment = createPaymentRecord(line, options);
          this.push({type: 'payment', record: payment});
        }
        callback();
      } catch (err) {
        callback(err as Error);
      }
    },
  });
}

function createEventsTransformer(options: Import.Options) {
  return new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(line, enc, callback) {
      try {
        const event = createEventRecord(line, options);
        this.push({type: 'event', record: event});
        callback();
      } catch (err) {
        callback(err as Error);
      }
    },
  });
}

// Data exported from Cityvizor contain 4 payment columns, only one of them should contain a non-zero amount
function mergeAmount<T extends PaymentRecord | AccountingRecord>(
  row: Row,
  record: T
): T {
  const nonzeroField = [
    'amount',
    'incomeAmount',
    'budgetIncomeAmount',
    'expenditureAmount',
    'budgetExpenditureAmount',
  ].find((field: string) => row[field] && row[field] !== '0');
  if (nonzeroField) {
    record.amount = Number(row[nonzeroField]);
  }
  return record;
}

function createPaymentRecord(row: Row, options: Import.Options): PaymentRecord {
  const record = [
    'paragraph',
    'item',
    'unit',
    'event',
    'amount',
    'date',
    'counterpartyId',
    'counterpartyName',
    'description',
  ].reduce(
    (acc, c) => {
      if (row[c]) acc[c] = row[c];
      return acc;
    },
    {
      profileId: options.profileId,
      year: options.year,
    } as PaymentRecord
  );
  return mergeAmount(row, record);
}

function createAccountingRecord(
  row: Row,
  options: Import.Options
): AccountingRecord {
  const record = [
    'type',
    'paragraph',
    'item',
    'event',
    'unit',
    'amount',
  ].reduce(
    (acc, c) => {
      if (row[c]) acc[c] = row[c];
      return acc;
    },
    {
      profileId: options.profileId,
      year: options.year,
    } as AccountingRecord
  );
  return mergeAmount(row, record);
}

function createEventRecord(row: Row, options: Import.Options): EventRecord {
  return ['id', 'name', 'description'].reduce(
    (acc, c) => {
      if (row[c]) acc[c] = row[c];
      return acc;
    },
    {
      profileId: options.profileId,
      year: options.year,
    } as EventRecord
  );
}
