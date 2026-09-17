import iconv from "iconv-lite";
import { Readable } from "stream";
import {
  createKxxRecordStream,
  KxxRecord,
} from "../src/worker/import/ginis/parser";
import { collectObjects } from "./helpers/stream";

describe("GINIS KXX parser", () => {
  it("parses an organization unit following the eight-digit ICO", async () => {
    const source = [
      "5/@44992785160003000MBMC",
      "6/@44992785160100 2 2026",
      "G/@01   100001000231001000006310516300000000000000000000001610000000000000000000000000000 000000000000002820 ",
      "G/$0001   100001ZBÚ_bankovní poplatek",
      "",
    ].join("\r\n");
    const warnings: unknown[] = [];
    const input = Readable.from([iconv.encode(source, "windows-1250")]);

    const records = (await collectObjects(
      createKxxRecordStream(input, warning => warnings.push(warning))
    )) as KxxRecord[];

    expect(warnings).toEqual([]);
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      organization: "44992785",
      organizationUnit: "16",
      type: 0,
      input: 2,
      id: 100001,
    });
    expect(records[0].date.getFullYear()).toBe(2026);
    expect(records[0].date.getMonth()).toBe(0);
    expect(records[0].date.getDate()).toBe(1);
    expect(records[0].balances).toHaveLength(1);
    expect(records[0].balances[0].comments).toEqual([
      "ZBÚ_bankovní poplatek",
    ]);
  });
});
