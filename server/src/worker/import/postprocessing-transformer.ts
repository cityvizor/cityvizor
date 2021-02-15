import {Transform, TransformCallback} from 'stream';
import {Import} from './import';

export class PostprocessingTransformer extends Transform {
  eventIds: number[] = [];

  constructor() {
    super({readableObjectMode: true, writableObjectMode: true});
  }

  _transform(
    chunk: Import.ImportChunk,
    encoding: string,
    callback: TransformCallback
  ) {
    // remove duplicate events
    if (chunk.type === 'event') {
      if (this.eventIds.indexOf(chunk.record.id) !== -1) {
        callback(
          new Error(
            `Duplicate event with id ${chunk.record.id} found, aborting!`
          )
        );
      }

      this.eventIds.push(chunk.record.id);
    }

    // Data integrity checking
    let fields: [string, string[]][] = [];
    if (chunk.type === 'event') {
      fields = [
        ['id', ['number', 'mandatory']],
        ['name', ['mandatory']],
      ];
    }
    if (chunk.type === 'accounting') {
      fields = [
        ['paragraph', ['number', 'mandatory']],
        ['item', ['number', 'mandatory']],
        ['event', ['number']],
        ['unit', ['number']],
        ['amount', ['number', 'mandatory']],
      ];
    }
    if (chunk.type === 'payment') {
      fields = [
        ['paragraph', ['number', 'mandatory']],
        ['item', ['number', 'mandatory']],
        ['event', ['number']],
        ['unit', ['number']],
        ['amount', ['number', 'mandatory']],
        ['date', ['date']],
        ['counterpartyId', ['number']],
      ];
    }
    let err: Error | null = null;
    fields.forEach(([field, types]) => {
      types.forEach(type => {
        if (!tests[type](chunk.record[field])) {
          // Can't call the callback here, only one callback call is allowed per transform
          err = invalidField(field, type, chunk.record);
        }
      });
    });
    callback(err, chunk);
  }
}

const tests = {
  number: (n?: string | number) => (n ? !isNaN(Number(n)) : true),
  date: (n?: string | number) =>
    n
      ? /^\d{4}-\d{2}-\d{2}$/.test(String(n)) && !isNaN(Date.parse(String(n)))
      : true,
  mandatory: (n?: string | number) => String(n)?.length > 0,
};

function invalidField(field: string, type: string, row: {}): Error {
  if (type === 'mandatory') {
    return new Error(
      `Field "${field}" is mandatory and is missing.\nRow processed: ${JSON.stringify(
        row
      )}`
    );
  } else {
    return new Error(
      `Failed to convert field "${field}": ${
        row[field]
      } to ${type}.\nRow processed: ${JSON.stringify(row)}`
    );
  }
}
