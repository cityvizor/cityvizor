import iconv from "iconv-lite";
import { Readable } from "stream";
import {
  createKxxRecordStream,
  KxxRecord,
} from "../src/worker/import/ginis/parser";
import { collectObjects } from "./helpers/stream";
import { createKxxTransformer } from "../src/worker/import/ginis/transformer";
import { kxxAccountingLine as line } from "./helpers/kxx-source";

describe("GINIS KXX parser", () => {
  function input(period: string, accounting = line) {
    return Readable.from([
      iconv.encode(
        ["5/@44992785160003000MBMC", period, accounting, ""].join("\r\n"),
        "windows-1250"
      ),
    ]);
  }
  it("rejects invalid source dates before Date can normalize them", async () => {
    await expect(
      collectObjects(
        createKxxRecordStream(
          input("6/@44992785160200 2 2026", line.replace("G/@01", "G/@31"))
        )
      )
    ).rejects.toThrow("invalid calendar date");
  });
  it("keeps invoice metadata with foreign partner codes in technical balances only", async () => {
    const technical = [
      "G/@01   10000100079703110000000006510000000000SK00000000000000000000000000000000000000000 000000000002000000 ",
      "G/@01   1000010007970603000000990005000000000000000000000000000000000SK000000000000000000 000000000001652893 ",
    ];
    const parser = createKxxRecordStream(
      input(
        "6/@44992785160100 2 2026",
        [
          line,
          ...technical,
          "G/#0001   100001*EVK-KOF-2026001;*EVKT-Pronájem;",
        ].join("\r\n")
      )
    );
    const diagnostics: unknown[] = [];
    const chunks = await collectObjects(
      parser.pipe(
        createKxxTransformer({
          profileId: 45,
          year: 2026,
          onDiagnostic: diagnostic => diagnostics.push(diagnostic),
        })
      )
    );
    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toMatchObject({
      type: "accounting",
      record: { type: "KOF", amount: 28.2 },
    });
    expect(chunks[1]).toMatchObject({
      type: "payment",
      record: { description: "Pronájem", amount: 28.2 },
    });
    expect(diagnostics).toHaveLength(2);
    await expect(
      collectObjects(
        createKxxRecordStream(
          input(
            "6/@44992785160100 2 2026",
            technical[0].replace("0651", "5163")
          )
        )
      )
    ).rejects.toThrow("non-numeric UZ/ORG");
  });
  it.each(["G/#xxxx   100001*EVK-KDF-2026001;", "G/$0001   x00001Popis"])(
    "rejects malformed metadata/comment headers: %s",
    async metadata => {
      await expect(
        collectObjects(
          createKxxRecordStream(
            input("6/@44992785160100 2 2026", line + "\r\n" + metadata)
          )
        )
      ).rejects.toThrow("invalid metadata or comment line");
    }
  );
  it("preserves negative amounts, Czech text and split Windows-1250 bytes", async () => {
    const source = [
      "5/@44992785160003000MBMC",
      "6/@44992785160100 2 2026",
      line.slice(0, -1) + "-",
      "G/$0001   100001Žluťoučký kůň",
    ].join("\r\n");
    const bytes = iconv.encode(source, "windows-1250");
    const records = (await collectObjects(
      createKxxRecordStream(
        Readable.from([...bytes].map(value => Buffer.from([value])))
      )
    )) as KxxRecord[];
    expect(records[0].balances[0].d).toBe(-28.2);
    expect(records[0].balances[0].comments).toEqual(["Žluťoučký kůň"]);
  });
  it("parses an organization unit following the eight-digit ICO", async () => {
    const warnings: unknown[] = [];
    const records = (await collectObjects(
      createKxxRecordStream(
        input(
          "6/@44992785160100 2 2026",
          line + "\r\nG/$0001   100001ZBÚ_bankovní poplatek"
        ),
        warning => warnings.push(warning)
      )
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
    expect(records[0].date).toEqual(new Date(2026, 0, 1));
    expect(records[0].balances).toHaveLength(1);
    expect(records[0].balances[0].comments).toEqual(["ZBÚ_bankovní poplatek"]);
  });
});
