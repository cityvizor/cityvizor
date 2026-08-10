import csvparse from "csv-parse";
import * as fs from "fs-extra";
import path from "path";
import { pipeline, Transform } from "stream";
import { Import } from "../import";
import { promisify } from "util";
import {
  ImportValidationIssueCode,
  PostprocessingTransformer,
  validateImportChunk,
} from "../postprocessing-transformer";
import { DatabaseWriter } from "../db-writer";
import { PaymentRecord, AccountingRecord } from "../../../schema";
import { importLogger } from "../import-logger";

const maxAccountingAmount = 1_000_000_000_000;

type InternetStreamWarningCode =
  | ImportValidationIssueCode
  | "AMOUNT_OUT_OF_RANGE";

interface ImportStats {
  sourceRows: number;
  acceptedRows: number;
  warningCount: number;
  warningCounts: Partial<Record<InternetStreamWarningCode, number>>;
}

interface ParsedLine {
  record: Record<string, string>;
  info: {
    lines: number;
  };
}

export interface InternetStreamImportResult {
  warningCount: number;
}

export async function importInternetStream(
  options: Import.Options
): Promise<InternetStreamImportResult> {
  importLogger.log(`Starting import: ${JSON.stringify(options)}`);

  const csvPaths = [
    path.join(options.importDir, "RU.csv"),
    path.join(options.importDir, "SK.csv"),
  ];
  await validateInputFiles(csvPaths);

  await options
    .transaction("data.payments")
    .where({ profileId: options.profileId, year: options.year })
    .delete();
  await options
    .transaction("data.accounting")
    .where({ profileId: options.profileId, year: options.year })
    .delete();

  const totalStats = createStats();
  for (const filePath of csvPaths) {
    options.fileName = filePath;
    const fileName = path.basename(filePath);
    const fileStats = createStats();
    await promisify(pipeline)(
      fs.createReadStream(filePath),
      createParser(fileName),
      createTransformer(options, fileName, fileStats),
      new PostprocessingTransformer(),
      new DatabaseWriter(options)
    );

    if (fileStats.acceptedRows === 0) {
      throw new Error(`${fileName} does not contain any usable data rows.`);
    }
    mergeStats(totalStats, fileStats);
  }

  if (totalStats.warningCount > 0) {
    importLogger.log("Import completed with warnings.");
    importLogger.log(`Source rows: ${totalStats.sourceRows}.`);
    importLogger.log(`Accepted source rows: ${totalStats.acceptedRows}.`);
    importLogger.log(`Skipped source rows: ${totalStats.warningCount}.`);
    Object.entries(totalStats.warningCounts).forEach(([code, count]) => {
      importLogger.log(`${code}: ${count}.`);
    });
  }

  return { warningCount: totalStats.warningCount };
}

const internetStreamHeaders = [
  "DOKLAD_ROK",
  "DOKLAD_DATUM",
  "DOKLAD_AGENDA",
  "DOKLAD_CISLO",
  "ORGANIZACE",
  "ORGANIZACE_NAZEV",
  "ORJ",
  "ORJ_NAZEV",
  "PARAGRAF",
  "PARAGRAF_NAZEV",
  "POLOZKA",
  "POLOZKA_NAZEV",
  "SUBJEKT_IC",
  "SUBJEKT_NAZEV",
  "CASTKA_MD",
  "CASTKA_DAL",
  "POZNAMKA",
];

const requiredHeaders = ["PARAGRAF", "POLOZKA", "CASTKA_MD", "CASTKA_DAL"];

function parseHeader(
  headerLine: string[],
  fileName: string
): (string | false)[] {
  const normalizedHeaders = headerLine.map(header => header.trim());
  const required = fileName === "SK.csv"
    ? [...requiredHeaders, "DOKLAD_AGENDA"]
    : requiredHeaders;
  const missing = required.filter(
    requiredHeader => !normalizedHeaders.includes(requiredHeader)
  );
  if (missing.length > 0) {
    throw new Error(
      `${fileName} is missing required columns: ${missing.join(", ")}.`
    );
  }
  return normalizedHeaders.map(header =>
    internetStreamHeaders.includes(header) ? header : false
  );
}

function createParser(fileName: string) {
  return csvparse({
    bom: true,
    delimiter: ";",
    columns: line => parseHeader(line, fileName),
    info: true,
    relax_column_count: true,
    skip_empty_lines: true,
  });
}

function createTransformer(
  options: Import.Options,
  fileName: string,
  stats: ImportStats
) {
  return new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(parsedLine: ParsedLine, enc, callback) {
      const line = parsedLine.record;
      const sourceRow = parsedLine.info.lines;
      stats.sourceRows += 1;

      const missingField = requiredHeaders.find(
        field => line[field] == null || String(line[field]).trim() === ""
      );
      if (missingField) {
        logSkippedRow(
          stats,
          "MISSING_REQUIRED_VALUE",
          fileName,
          sourceRow,
          line,
          `required field ${missingField} is empty`
        );
        callback();
        return;
      }

      // RU.csv contains "upraveny rozpocet" records, but they do not have "ROZ" type
      const recordType = fileName === "RU.csv" ? "ROZ" : line.DOKLAD_AGENDA;
      const amountMd = Number(line.CASTKA_MD);
      const amountDal = Number(line.CASTKA_DAL);
      const paragraph = Number(line.PARAGRAF);
      const item = Number(line.POLOZKA);
      const event = optionalNumber(line.ORGANIZACE);
      const unit = optionalNumber(line.ORJ);
      const amountFinal =
        item < 5000 ? amountMd - amountDal : amountDal - amountMd;

      const accounting: AccountingRecord = {
        type: recordType,
        paragraph,
        item,
        event,
        unit,
        amount: amountFinal,

        profileId: options.profileId,
        year: options.year,
      };
      const chunks: Import.ImportChunk[] = [
        { type: "accounting", record: accounting },
      ];
      if (recordType === "KDF" || recordType === "KOF") {
        const payment: PaymentRecord = {
          paragraph,
          item,
          event,
          amount: amountFinal,
          date: line.DOKLAD_DATUM,
          counterpartyId: line.SUBJEKT_IC,
          counterpartyName: line.SUBJEKT_NAZEV,
          description: line.POZNAMKA,

          profileId: options.profileId,
          year: options.year,
        };
        chunks.push({ type: "payment", record: payment });
      }

      const validationIssue = chunks
        .map(chunk => ({ chunk, issue: validateImportChunk(chunk) }))
        .find(result => result.issue !== null);
      if (validationIssue?.issue) {
        const value = validationIssue.chunk.record[validationIssue.issue.field];
        logSkippedRow(
          stats,
          validationIssue.issue.code,
          fileName,
          sourceRow,
          line,
          `field ${validationIssue.issue.field} has unsupported value ${String(value)}`
        );
        callback();
        return;
      }

      const roundedAbsoluteAmount =
        Math.round(Math.abs(amountFinal) * 100) / 100;
      if (roundedAbsoluteAmount >= maxAccountingAmount) {
        logSkippedRow(
          stats,
          "AMOUNT_OUT_OF_RANGE",
          fileName,
          sourceRow,
          line,
          `amount ${amountFinal} is outside numeric(14,2)`
        );
        callback();
        return;
      }

      chunks.forEach(chunk => this.push(chunk));
      stats.acceptedRows += 1;
      callback();
    },
  });
}

function createStats(): ImportStats {
  return {
    sourceRows: 0,
    acceptedRows: 0,
    warningCount: 0,
    warningCounts: {},
  };
}

function optionalNumber(value: string | undefined): number {
  return value == null || value.trim() === ""
    ? (undefined as unknown as number)
    : Number(value);
}

function mergeStats(target: ImportStats, source: ImportStats) {
  target.sourceRows += source.sourceRows;
  target.acceptedRows += source.acceptedRows;
  target.warningCount += source.warningCount;
  Object.entries(source.warningCounts).forEach(([code, count]) => {
    target.warningCounts[code as InternetStreamWarningCode] =
      (target.warningCounts[code as InternetStreamWarningCode] || 0) +
      Number(count);
  });
}

function logSkippedRow(
  stats: ImportStats,
  code: InternetStreamWarningCode,
  fileName: string,
  sourceRow: number,
  line: Record<string, string>,
  reason: string
) {
  stats.warningCount += 1;
  stats.warningCounts[code] = (stats.warningCounts[code] || 0) + 1;
  const document = line.DOKLAD_CISLO
    ? `, document ${line.DOKLAD_CISLO}`
    : "";
  importLogger.log(
    `WARNING ${code}: ${fileName}, row ${sourceRow}${document}: ${reason}; row skipped.`
  );
}

async function validateInputFiles(csvPaths: string[]) {
  for (const filePath of csvPaths) {
    let stat;
    try {
      stat = await fs.stat(filePath);
    } catch {
      throw new Error(`${path.basename(filePath)} is missing.`);
    }
    if (!stat.isFile() || stat.size === 0) {
      throw new Error(`${path.basename(filePath)} is empty or is not a file.`);
    }
  }
}
