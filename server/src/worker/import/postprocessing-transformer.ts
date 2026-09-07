import { Transform, TransformCallback } from "stream";
import { Import } from "./import";
import {
  AccountingRecord,
  EventRecord,
  PaymentRecord,
} from "../../schema/database";

type Row = EventRecord | PaymentRecord | AccountingRecord;

export type ImportValidationIssueCode =
  | "INVALID_NUMBER_FORMAT"
  | "INVALID_DATE_FORMAT"
  | "MISSING_REQUIRED_VALUE";

export interface ImportValidationIssue {
  code: ImportValidationIssueCode;
  field: string;
  message: string;
}

export class PostprocessingTransformer extends Transform {
  eventIds: number[] = [];

  constructor() {
    super({ readableObjectMode: true, writableObjectMode: true });
  }

  _transform(
    chunk: Import.ImportChunk,
    encoding: string,
    callback: TransformCallback
  ) {
    // remove duplicate events
    if (chunk.type === "event") {
      if (this.eventIds.indexOf(chunk.record.id) !== -1) {
        callback(
          new Error(
            `Duplicate event with id ${chunk.record.id} found, aborting!`
          )
        );
        return;
      }

      this.eventIds.push(chunk.record.id);
    }

    const issue = validateImportChunk(chunk);
    callback(issue ? new Error(issue.message) : null, chunk);
  }
}

export function validateImportChunk(
  chunk: Import.ImportChunk
): ImportValidationIssue | null {
  // Data integrity checking
  let fields: [string, string[]][] = [];
  if (chunk.type === "event") {
    fields = [
      ["id", ["number", "mandatory"]],
      ["name", ["mandatory"]],
    ];
  }
  if (chunk.type === "accounting") {
    fields = [
      ["paragraph", ["number", "mandatory"]],
      ["item", ["number", "mandatory"]],
      ["event", ["number"]],
      ["unit", ["number"]],
      ["amount", ["number", "mandatory"]],
    ];
  }
  if (chunk.type === "payment") {
    fields = [
      ["paragraph", ["number", "mandatory"]],
      ["item", ["number", "mandatory"]],
      ["event", ["number"]],
      ["unit", ["number"]],
      ["amount", ["number", "mandatory"]],
      ["date", ["date"]],
      ["counterpartyId", ["number"]],
    ];
  }
  let issue: ImportValidationIssue | null = null;
  fields.forEach(([field, types]) => {
    types.forEach(type => {
      if (!tests[`${type}Test`](chunk.record[field])) {
        issue = invalidField(field, type, chunk.record);
      }
    });
  });
  return issue;
}

const tests = {
  numberTest: (n?: string | number) =>
    n == null || n === "" ? true : Number.isFinite(Number(n)),
  dateTest: (n?: string | number) => (n ? isValidDate(String(n)) : true),
  mandatoryTest: (n?: string | number) =>
    n !== undefined && n !== null && String(n).length > 0,
};

function isValidDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function invalidField(
  field: string,
  type: string,
  row: Row
): ImportValidationIssue {
  if (type === "mandatory") {
    return {
      code: "MISSING_REQUIRED_VALUE",
      field,
      message: `Field "${field}" is mandatory and is missing.\nRow processed: ${JSON.stringify(
        row
      )}`,
    };
  } else {
    return {
      code:
        type === "date" ? "INVALID_DATE_FORMAT" : "INVALID_NUMBER_FORMAT",
      field,
      message: `Failed to convert field "${field}": ${
        row[field]
      } to ${type}.\nRow processed: ${JSON.stringify(row)}`,
    };
  }
}
