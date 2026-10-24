import {
  createCityvizorParser,
  createCityvizorTransformer,
} from "../src/worker/import/cityvizor/parser";
import * as fs from "fs";
import * as path from "path";
import { CityvizorFileType } from "../src/worker/import/cityvizor/cityvizor-file-type";
import { Import } from "../src/worker/import/import";
import { collectObjects } from "./helpers/stream";
import { identifyCityvizorImportFiles } from "../src/worker/import/cityvizor/input-files";

const options = {
  profileId: 10,
  year: 2024,
  transaction: undefined,
  importDir: "/tmp/cityvizor-test",
  append: false,
  format: "cityvizor",
  profileType: "municipality",
} as unknown as Import.Options;

function fixturePath(fileName: string): string {
  return path.join(__dirname, "fixtures", "import", fileName);
}

describe("cityvizor import parser", () => {
  it("can parse and transform a sample import CSV file", async () => {
    const parser = createCityvizorParser(
      CityvizorFileType.DATA,
      "municipality"
    );
    const transformer = createCityvizorTransformer(
      CityvizorFileType.DATA,
      options
    );

    parser.pipe(transformer);
    const output = collectObjects(transformer);

    fs.createReadStream(fixturePath("test_import.csv")).pipe(parser);

    const chunks = await output;
    const accountingChunks = chunks.filter(
      chunk => (chunk as { type?: string }).type === "accounting"
    );
    const paymentChunks = chunks.filter(
      chunk => (chunk as { type?: string }).type === "payment"
    );

    expect(chunks).toHaveLength(19);
    expect(accountingChunks).toHaveLength(14);
    expect(paymentChunks).toHaveLength(5);
  });

  it("distinguishes accounting inputs from an events-only import", () => {
    const accountingFiles = identifyCityvizorImportFiles([
      "data.csv",
      "accounting.csv",
      "payments.csv",
    ]);
    const eventsFiles = identifyCityvizorImportFiles(["events.csv"]);

    expect(accountingFiles).toEqual({
      dataFile: "data.csv",
      eventsFile: undefined,
      paymentsFile: "payments.csv",
      accountingFile: "accounting.csv",
    });
    expect(eventsFiles).toEqual({
      dataFile: undefined,
      eventsFile: "events.csv",
      paymentsFile: undefined,
      accountingFile: undefined,
    });
  });
});
