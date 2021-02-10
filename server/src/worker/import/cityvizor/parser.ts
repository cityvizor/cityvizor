import csvparse from 'csv-parse';
import {Transform} from 'stream';
import {Import} from '../import';
import logger from '../logger';
import {AccountingRecord, PaymentRecord, EventRecord} from '../../../schema';

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
};

const mandatoryAccountingHeaders = [
  'type',
  'paragraph',
  'item',
  'event',
  'amount',
];

const mandatoryPaymentsHeaders = [
  'type',
  'paragraph',
  'item',
  'unit',
  'event',
  'amount',
  'date',
  'counterpartyId',
  'counterpartyName',
  'description',
];

const mandatoryEventHeaders = ['id', 'name'];

export enum CityvizorFileType {
  ACCOUNTING,
  PAYMENTS,
  DATA,
  EVENTS,
}

export function createCityvizorParser(
  type: CityvizorFileType
): csvparse.Parser {
  let headers: string[] = [];
  switch (type) {
    case CityvizorFileType.ACCOUNTING:
      headers = mandatoryAccountingHeaders;
      break;
    case CityvizorFileType.DATA:
    case CityvizorFileType.PAYMENTS:
      headers = mandatoryPaymentsHeaders;
      break;
    case CityvizorFileType.EVENTS:
      headers = mandatoryEventHeaders;
      break;
  }

  const parseHeader = (
    headerLine: string[],
    headerNames: string[]
  ): string[] => {
    // remove possible BOM at the beginning of file, also removes extra whitespaces
    headerLine = headerLine.map(item => item.trim());
    logger.log(`Searching for these headers: [${headerNames}]`);
    logger.log(
      `The header array being searched for field names: [${headerLine}]`
    );

    const foundHeaders: string[] = headerLine
      .map(originalField => {
        // browse through all the target fields if originalField is someones alias
        return Object.keys(headerAliases).find(
          key => headerAliases[key].indexOf(originalField) !== -1
        );
      })
      .filter(item => item) as string[];
    headerNames.forEach(h => {
      if (foundHeaders.indexOf(h) === -1) {
        throw Error(`Failed to find column header "${h}"`);
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

      if (recordType === 'KDF' || recordType === 'KOF') {
        try {
          const payment = createPaymentRecord(line, options);
          this.push({type: 'payment', record: payment});
          callback();
        } catch (err) {
          callback(err);
        }
      } else {
        const accounting = createAccountingRecord(line, options);
        this.push({type: 'accounting', record: accounting});
        callback();
      }
    },
  });
}

function createEventsTransformer(options: Import.Options) {
  return new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(line, enc, callback) {
      const event = createEventRecord(line, options);
      this.push({type: 'event', record: event});
      callback();
    },
  });
}

function createPaymentRecord(row: {}, options: Import.Options): PaymentRecord {
  return [
    'type',
    'paragraph',
    'item',
    'event',
    'amount',
    'date',
    'counterpartyId',
    'counterpartyName',
    'description',
  ].reduce((acc, c) => (acc[c] = row[c]), {
    profileId: options.profileId,
    year: options.year,
  } as PaymentRecord);
}

function createAccountingRecord(
  row: {},
  options: Import.Options
): AccountingRecord {
  return ['type', 'paragraph', 'item', 'event', 'unit', 'amount'].reduce(
    (acc, c) => (acc[c] = row[c]),
    {
      profileId: options.profileId,
      year: options.year,
    } as AccountingRecord
  );
}

function createEventRecord(row: {}, options: Import.Options): EventRecord {
  return ['id', 'name', 'description'].reduce((acc, c) => (acc[c] = row[c]), {
    profileId: options.profileId,
    year: options.year,
  } as EventRecord);
}
