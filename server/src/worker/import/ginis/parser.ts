import iconv from "iconv-lite";
import { Readable } from "stream";
import { kxxreader } from "kxx-reader";

export { KxxRecord, KxxRecordBalance } from "kxx-reader-core";

/**
 * Decode a GINIS KXX byte stream and parse it into KXX records.
 *
 * KXX exports use Windows-1250. Decoding before passing data to kxx-reader is
 * necessary to preserve Czech payment descriptions and counterparty names.
 */
export function createKxxRecordStream(
  input: Readable,
  onWarning?: (warning: unknown) => void
): Readable {
  const decoder = iconv.decodeStream("windows-1250");
  const parser = kxxreader();

  if (onWarning) parser.on("warning", onWarning);

  input.on("error", error => parser.destroy(error));
  decoder.on("error", error => parser.destroy(error));

  input.pipe(decoder).pipe(parser);
  return parser;
}
