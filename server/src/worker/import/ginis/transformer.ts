import { Transform, TransformCallback } from "stream";
import { Import } from "../import";
import { validateImportChunk } from "../postprocessing-transformer";
import { KxxRecord } from "./parser";

export interface KxxDiagnostic {
  code: "IGNORED_RECORD_TYPE" | "TECHNICAL_BALANCE";
  recordId: number;
  recordType: number;
  reason: string;
}
export type KxxTransformerOptions = Pick<
  Import.Options,
  "profileId" | "year"
> & {
  organization?: string;
  organizationUnit?: string;
  onDiagnostic?: (diagnostic: KxxDiagnostic) => void;
};
export type KxxImportChunk = Import.AccountingChunk | Import.PaymentChunk;

// GORDIC USC methodology: current budget = 2 + signed changes 3, 7 and 8.
const budgetTypes = [2, 3, 7, 8];
const ignoredTypes: Readonly<Record<number, string>> = {
  1: "Opening balances",
  4: "Year-end accounting entries",
  5: "Closing entries",
  6: "Budget reservations",
  9: "Budget proposal",
  10: "Contracts",
  11: "Contracts linked to public procurement",
  12: "Public procurement",
  13: "Expected actual amounts",
  15: "Orders linked directly to a plan",
  16: "Orders linked to a contract",
  // Match the demo's exclusion from accounting totals; meaning is unverified.
  18: "Excluded for demo compatibility; record type meaning is unverified",
};

/** Convert parsed KXX balances to independent accounting and payment chunks. */
export function transformKxxRecord(
  record: KxxRecord,
  options: KxxTransformerOptions
): KxxImportChunk[] {
  if (
    !Number.isFinite(record.date.getTime()) ||
    record.date.getFullYear() !== options.year
  ) {
    throw new Error(
      `KXX record ${record.id} has an invalid date or a different year.`
    );
  }
  if (
    !/^\d{8}$/.test(record.organization) ||
    (record.organizationUnit !== undefined &&
      !/^\d{2}$/.test(record.organizationUnit)) ||
    (options.organization !== undefined &&
      record.organization !== options.organization) ||
    (options.organizationUnit !== undefined &&
      record.organizationUnit !== options.organizationUnit)
  ) {
    throw new Error(
      `KXX record ${record.id} has an invalid or unexpected organization/unit.`
    );
  }
  if (Object.prototype.hasOwnProperty.call(ignoredTypes, record.type)) {
    options.onDiagnostic?.({
      code: "IGNORED_RECORD_TYPE",
      recordId: record.id,
      recordType: record.type,
      reason: ignoredTypes[record.type],
    });
    return [];
  }
  if (record.type !== 0 && !budgetTypes.includes(record.type)) {
    throw new Error(`Unsupported KXX record type: ${record.type}`);
  }

  const budget = budgetTypes.includes(record.type);
  const evk = record.meta?.EVK;
  const invoiceType = evk?.KDF ? "KDF" : evk?.KOF ? "KOF" : undefined;
  if (evk?.KDF && evk?.KOF) {
    throw new Error(
      `KXX record ${record.id} contains both KDF and KOF metadata.`
    );
  }
  const type = budget ? "ROZ" : invoiceType ?? "UCT";
  const chunks: KxxImportChunk[] = [];
  const diagnostics: KxxDiagnostic[] = [];

  for (const balance of record.balances) {
    if (!Number.isSafeInteger(balance.pol)) {
      throw new Error(`KXX record ${record.id} has an invalid budget item.`);
    }
    // Keep the budget classification, including financing and internal transfers.
    if (balance.pol <= 1000 || balance.pol >= 9000) {
      diagnostics.push({
        code: "TECHNICAL_BALANCE",
        recordId: record.id,
        recordType: record.type,
        reason: `Item ${balance.pol} is outside budget classification.`,
      });
      continue;
    }
    if (
      ![balance.odpa, balance.org, balance.orj].every(
        value => Number.isSafeInteger(value) && value >= 0
      ) ||
      ![balance.md, balance.d].every(Number.isFinite)
    ) {
      throw new Error(
        `KXX record ${record.id} has invalid classification or amount.`
      );
    }
    const expenditure = balance.pol >= 5000 && balance.pol < 8000;
    const md = Number(balance.md.toFixed(2)) * 100;
    const dal = Number(balance.d.toFixed(2)) * 100;
    if (![Math.round(md), Math.round(dal)].every(Number.isSafeInteger)) {
      throw new Error(
        `KXX record ${record.id} has an amount exceeding safe cent precision.`
      );
    }
    const amount =
      (expenditure
        ? Math.round(dal) - Math.round(md)
        : Math.round(md) - Math.round(dal)) / 100;
    const accounting = {
      profileId: options.profileId,
      year: options.year,
      type,
      paragraph: balance.odpa,
      item: balance.pol,
      event: balance.org,
      unit: balance.orj,
      amount,
    };
    // The invoice is already represented by this accounting movement.
    chunks.push({ type: "accounting", record: accounting });
    if (!budget && invoiceType) {
      chunks.push({
        type: "payment",
        record: {
          profileId: options.profileId,
          year: options.year,
          paragraph: balance.odpa,
          item: balance.pol,
          event: balance.org,
          unit: balance.orj,
          amount,
          // The parser creates local dates; UTC conversion could shift the day.
          date: [
            record.date.getFullYear(),
            String(record.date.getMonth() + 1).padStart(2, "0"),
            String(record.date.getDate()).padStart(2, "0"),
          ].join("-"),
          counterpartyId: record.meta?.IC || undefined,
          counterpartyName: record.meta?.DICT || undefined,
          description:
            record.meta?.EVKT ||
            record.comments.join("\n").split(/\r?\n/)[0] ||
            undefined,
        },
      });
    }
  }
  // Validate the whole source record before any of its chunks are emitted.
  for (const chunk of chunks) {
    const issue = validateImportChunk(chunk);
    if (issue) throw new Error(issue.message);
    if (Math.abs(chunk.record.amount) >= 1_000_000_000_000) {
      throw new Error(
        `KXX record ${record.id} has an amount outside numeric(14,2).`
      );
    }
  }
  diagnostics.forEach(diagnostic => options.onDiagnostic?.(diagnostic));
  return chunks;
}

export function createKxxTransformer(
  options: KxxTransformerOptions
): Transform {
  const transformer = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(
      record: KxxRecord,
      encoding: string,
      callback: TransformCallback
    ) {
      try {
        const chunks = transformKxxRecord(record, {
          ...options,
          onDiagnostic: diagnostic => {
            options.onDiagnostic?.(diagnostic);
            this.emit("diagnostic", diagnostic);
          },
        });
        chunks.forEach(chunk => this.push(chunk));
        callback();
      } catch (error) {
        callback(error as Error);
      }
    },
  });
  return transformer;
}
