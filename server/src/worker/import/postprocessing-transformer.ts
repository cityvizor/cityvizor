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
    let fields: [string, string[]][] = []
    if (chunk.type == 'event') {
      fields = [
        ["id", ["number", "mandatory"]],
        ["name", ["mandatory"]],
        ["description", []]
      ]
    }
    if (chunk.type == 'accounting') {
      fields = [
        ["type", ["mandatory"]],
        ["paragraph", ["number", "mandatory"]],
        ["item", ["number"]],
        ["event", ["number"]],
        ["unit", ["number"]],
        ["amount", ["number", "mandatory"]],
      ]
    }
    if (chunk.type == "payment") {
      fields = [
        ["type", ["mandatory"]],
        ["paragraph", ["number", "mandatory"]],
        ["item", ["number"]],
        ["event", ["number"]],
        ["unit", ["number"]],
        ["amount", ["number", "mandatory"]],
        ["date", ["date"]],
        ["counterpartyId", ["number"]],
        ["counterpartyName", ["number"]],
        ["description", []],
      ]
    }
    fields.forEach(([field, types]) => {
      types.forEach(type => {
        if (!tests[type](chunk.record["field"])) {
          invalidField(field, type, chunk.record)
        }
      })
    })
    callback(null, chunk);
  }
}

const tests = {
  "number": (n?: string) => (n && /\d+/.test(n)),
  "date": (n?: string) => (n && /\d{4}-\d{2}-\d{2}/.test(n) && !isNaN(Date.parse(n))),
  "mandatory": (n? : string) => (n)

}

function invalidField (field: string, type: string, row: {}): never {
  if (type == "mandatory") {
    throw new Error(
      `Field "${field}" is mandatory and is missing.\nRow processed: ${JSON.stringify(row)}`
    )
  }
  else {
    throw new Error(
      `Failed to convert field "${field}": ${
        row[field]
      } to ${type}.\nRow processed: ${JSON.stringify(row)}`
    );
  }
}