import iconv from "iconv-lite";
import { Readable, Transform } from "stream";
import { kxxreader } from "kxx-reader";

export { KxxRecord, KxxRecordBalance } from "kxx-reader-core";

export interface KxxSourceOptions {
  year?: number;
  organization?: string;
  organizationUnit?: string;
}

/** Check source fields before the core parser normalizes dates or skips headers. */
function createSourceValidator(options: KxxSourceOptions): Transform {
  let pending = "";
  let year: number | undefined;
  let month: number | undefined;
  let lineNumber = 0;
  const check = (line: string) => {
    lineNumber++;
    const fail = (reason: string): never => {
      throw new Error(`KXX line ${lineNumber}: ${reason}`);
    };
    if (line.startsWith("6/@")) {
      const match = /^6\/@(\d{8})(\d{2})?(\d{2})(\d{2}) (\d) (\d{4})$/.exec(
        line
      );
      if (!match) fail("invalid period header");
      const [, organization, unit, monthText, , inputText, yearText] = match!;
      month = Number(monthText);
      year = Number(yearText);
      if (month < 1 || month > 12 || year < 1900 || year > 9999)
        fail("invalid period");
      if (Number(inputText) > 7) fail("unsupported input identifier");
      if (options.year !== undefined && year !== options.year)
        fail("unexpected year");
      if (
        options.organization !== undefined &&
        organization !== options.organization
      )
        fail("unexpected organization");
      if (
        options.organizationUnit !== undefined &&
        unit !== options.organizationUnit
      )
        fail("unexpected organization unit");
    } else if (line.startsWith("G/@")) {
      if (year === undefined || month === undefined)
        fail("accounting line without a period header");
      const match =
        /^G\/@(\d{2})([ 0-9]{9})000(\d{3})([\d ]{4})(\d{2})\d\d(\d{4})(\d{4})(\d{3})([0-9A-Z]{9})(\d{10})([0-9A-Z]{13})(\d{16})(\d{2})([- ])(\d{16})(\d{2})([- ])/.exec(
          line
        );
      if (!match) fail("invalid accounting line or unsupported amount sign");
      const item = Number(match![7]);
      const nonNumericIdentifiers = !/^\d+$/.test(match![9] + match![11]);
      if (nonNumericIdentifiers) {
        if (item > 1000 && item < 9000)
          fail("non-numeric UZ/ORG in a budget-classified accounting line");
        // Technical balances can carry foreign partner codes (e.g. SK). The
        // core accepts only numbers; these fields are unused after the balance
        // is filtered by the transformer. Keep the line and its invoice metadata.
        const uz = /^\d+$/.test(match![9]) ? match![9] : "0".repeat(9);
        const org = /^\d+$/.test(match![11]) ? match![11] : "0".repeat(13);
        // Fixed-width fields: UZ at 39..47, ORJ at 48..57, ORG at 58..70.
        line =
          line.slice(0, 39) + uz + line.slice(48, 58) + org + line.slice(71);
      }
      const day = Number(match![1]);
      const date = new Date(year!, month! - 1, day);
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month! - 1 ||
        date.getDate() !== day
      )
        fail("invalid calendar date");
    } else if (line.startsWith("5/@")) {
      year = month = undefined;
      if (!/^5\/@\d{8}(?:\d{2})?\d{7}.{4}$/.test(line))
        fail("invalid organization header");
    } else if (/^G\/[#$]/.test(line)) {
      // Match the core parser's full header; otherwise it silently drops metadata.
      if (!/^G\/[#$]\d{4}[ 0-9]{9}.*$/.test(line))
        fail("invalid metadata or comment line");
    } else if (line) fail("unknown line format");
    return line;
  };
  return new Transform({
    decodeStrings: false,
    transform(chunk, encoding, callback) {
      try {
        pending += chunk.toString();
        let newline: number;
        while ((newline = pending.indexOf("\n")) !== -1) {
          const rawLine = pending.slice(0, newline).replace(/\r$/, "");
          const line = /^[56]\/@/.test(rawLine) ? rawLine.trimEnd() : rawLine;
          pending = pending.slice(newline + 1);
          this.push(check(line) + "\n");
        }
        callback();
      } catch (error) {
        callback(error as Error);
      }
    },
    flush(callback) {
      try {
        if (pending) {
          const rawLine = pending.replace(/\r$/, "");
          const line = /^[56]\/@/.test(rawLine) ? rawLine.trimEnd() : rawLine;
          this.push(check(line) + "\n");
        }
        callback();
      } catch (error) {
        callback(error as Error);
      }
    },
  });
}

/**
 * Decode a GINIS KXX byte stream and parse it into KXX records.
 *
 * KXX exports use Windows-1250. Decoding before passing data to kxx-reader is
 * necessary to preserve Czech payment descriptions and counterparty names.
 */
export function createKxxRecordStream(
  input: Readable,
  onWarning?: (warning: unknown) => void,
  options: KxxSourceOptions = {}
): Readable {
  const decoder = iconv.decodeStream("windows-1250") as Transform;
  const parser = kxxreader();
  const validator = createSourceValidator(options);

  if (onWarning) parser.on("warning", onWarning);

  input.on("error", error => parser.destroy(error));
  decoder.on("error", error => parser.destroy(error));
  validator.on("error", error => parser.destroy(error));
  parser.on("close", () => {
    input.destroy();
    decoder.destroy();
    validator.destroy();
  });

  input.pipe(decoder).pipe(validator).pipe(parser);
  return parser;
}
