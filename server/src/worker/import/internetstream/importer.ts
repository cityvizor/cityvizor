import csvparse from "csv-parse";
import * as fs from "fs-extra";
import path from "path";
import { pipeline, Transform } from "stream";
import { Import } from "../import";
import { promisify } from "util";
import { PostprocessingTransformer } from "../postprocessing-transformer";
import { DatabaseWriter } from "../db-writer";
import { PaymentRecord, AccountingRecord } from "../../../schema";
import { importLogger } from "../import-logger";

export async function importInternetStream(options: Import.Options) {
  importLogger.log(`Starting import: ${JSON.stringify(options)}}`);

  await options
    .transaction("data.payments")
    .where({ profileId: options.profileId, year: options.year })
    .delete();
  await options
    .transaction("data.accounting")
    .where({ profileId: options.profileId, year: options.year })
    .delete();

  const csvPaths = [
    path.join(options.importDir, "RU.csv"),
    path.join(options.importDir, "SK.csv"),
  ];
  for (const p of csvPaths) {
    options.fileName = p;
    const fileReader = fs.createReadStream(p);
    const isParser = createParser();
    const isTransformer = createTransformer(options);
    // The pipeline construct ensures every stream obtains the close signals
    // TODO: Remove the promisify workaround after upgrade to Node 15.x that has awaitable pipelines by default
    await promisify(pipeline)(
      fileReader,
      isParser,
      isTransformer,
      new PostprocessingTransformer(),
      new DatabaseWriter(options)
    );
  }
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

function parseHeader(headerLine: string[], headerNames: string[]): string[] {
  const foundHeaders: string[] = [];
  headerLine.forEach(h => {
    if (headerNames.includes(h)) {
      foundHeaders.push(h);
    }
  });
  return foundHeaders;
}

function createParser() {
  return csvparse({
    delimiter: ";",
    columns: line => parseHeader(line, internetStreamHeaders),
    relax_column_count: true,
  });
}

function createTransformer(options: Import.Options) {
  return new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(line, enc, callback) {
      // RU.csv contains "upraveny rozpocet" records, but they do not have "ROZ" type
      const recordType = options.fileName?.endsWith("RU.csv")
        ? "ROZ"
        : line.DOKLAD_AGENDA;
      const amountMd = line.CASTKA_MD;
      const amountDal = line.CASTKA_DAL;
      const item = Number(line.POLOZKA);
      const amountFinal =
        item < 5000 ? amountMd - amountDal : amountDal - amountMd;

      const accounting: AccountingRecord = {
        type: recordType,
        paragraph: line.PARAGRAF,
        item,
        event: line.ORGANIZACE,
        unit: line.ORJ,
        amount: amountFinal,

        profileId: options.profileId,
        year: options.year,
      };
      this.push({ type: "accounting", record: accounting });
      if (recordType === "KDF" || recordType === "KOF") {
        const payment: PaymentRecord = {
          paragraph: line.PARAGRAF,
          item,
          event: line.ORGANIZACE,
          amount: amountFinal,
          date: line.DOKLAD_DATUM,
          counterpartyId: line.SUBJEKT_IC,
          counterpartyName: line.SUBJEKT_NAZEV,
          description: line.POZNAMKA,

          profileId: options.profileId,
          year: options.year,
        };
        this.push({ type: "payment", record: payment });
      }
      callback();
    },
  });
}
