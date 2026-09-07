import * as fs from "fs-extra";
import os from "os";
import path from "path";
import { validateInternetStreamInputFiles } from "../src/worker/import/internetstream/input-files";

describe("validateInternetStreamInputFiles", () => {
  let importDir: string;

  beforeEach(async () => {
    importDir = await fs.mkdtemp(path.join(os.tmpdir(), "cityvizor-import-"));
  });

  afterEach(async () => {
    await fs.remove(importDir);
  });

  it("accepts non-empty RU.csv and SK.csv files", async () => {
    await fs.writeFile(path.join(importDir, "RU.csv"), "RU data");
    await fs.writeFile(path.join(importDir, "SK.csv"), "SK data");

    await expect(
      validateInternetStreamInputFiles(importDir)
    ).resolves.toBeUndefined();
  });

  it.each([
    ["RU.csv", "SK.csv"],
    ["SK.csv", "RU.csv"],
  ])("reports a missing %s file", async (missingFile, presentFile) => {
    await fs.writeFile(path.join(importDir, presentFile), "data");

    await expect(validateInternetStreamInputFiles(importDir)).rejects.toThrow(
      `Invalid InternetStream input files: ${missingFile} is missing.`
    );
  });

  it("reports both missing input files", async () => {
    await expect(validateInternetStreamInputFiles(importDir)).rejects.toThrow(
      "Invalid InternetStream input files: RU.csv is missing; SK.csv is missing."
    );
  });

  it.each(["RU.csv", "SK.csv"])("reports an empty %s file", async emptyFile => {
    await fs.writeFile(path.join(importDir, "RU.csv"), "RU data");
    await fs.writeFile(path.join(importDir, "SK.csv"), "SK data");
    await fs.writeFile(path.join(importDir, emptyFile), "");

    await expect(validateInternetStreamInputFiles(importDir)).rejects.toThrow(
      `Invalid InternetStream input files: ${emptyFile} is empty or is not a file.`
    );
  });
});
