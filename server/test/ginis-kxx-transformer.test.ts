import { once } from "events";
import { KxxRecord, KxxRecordBalance } from "../src/worker/import/ginis/parser";
import {
  createKxxTransformer,
  transformKxxRecord,
} from "../src/worker/import/ginis/transformer";

const options = { profileId: 45, year: 2026 };
function balance(overrides: Partial<KxxRecordBalance> = {}): KxxRecordBalance {
  return {
    su: 231,
    au: 10,
    kap: 0,
    odpa: 3613,
    pol: 6121,
    zj: 0,
    uz: 0,
    orj: 2,
    org: 161,
    md: 0,
    d: 100,
    comments: [],
    ...overrides,
  };
}
function record(overrides: Partial<KxxRecord> = {}): KxxRecord {
  return Object.assign(new KxxRecord(), {
    type: 0,
    organization: "44992785",
    id: 1,
    date: new Date(2026, 7, 31),
    balances: [balance()],
    ...overrides,
  });
}

describe("GINIS KXX transformer", () => {
  it("maps approved budget and signed changes to accounting with cent precision", () => {
    const amounts = [
      record({
        type: 2,
        meta: { EVK: { KDF: "1" } },
      }),
      record({ type: 3, balances: [balance({ d: -20 })] }),
      record({ type: 7, balances: [balance({ d: 5 })] }),
      record({ type: 8, balances: [balance({ d: -2 })] }),
    ].flatMap(value => transformKxxRecord(value, options));
    expect(amounts).toMatchObject(
      [100, -20, 5, -2].map(amount => ({
        type: "accounting",
        record: { type: "ROZ", amount },
      }))
    );
    expect(
      transformKxxRecord(
        record({ balances: [balance({ d: 0.3, md: 0.1 })] }),
        options
      )[0].record.amount
    ).toBe(0.2);
  });

  it("emits no partial source record when a later balance is invalid", async () => {
    const transformer = createKxxTransformer(options);
    const emitted: unknown[] = [];
    transformer.on("data", chunk => emitted.push(chunk));
    const error = once(transformer, "error");
    transformer.end(record({ balances: [balance(), balance({ d: 1e12 })] }));
    expect((await error)[0].message).toContain("numeric(14,2)");
    expect(emitted).toEqual([]);
  });

  it("keeps outgoing invoices, financing, reversals and internal transfers", () => {
    const chunks = transformKxxRecord(
      record({
        meta: { EVK: { KOF: "1" } },
        balances: [
          balance({ pol: 2132, md: 100, d: 25 }),
          balance({ pol: 8901, md: 0, d: 12 }),
          balance({ pol: 5345, odpa: 6330, d: 200 }),
          balance({ pol: 5169, md: 10, d: 0 }),
          balance({ pol: 9900, d: 500 }),
          balance({ pol: 0, d: 500 }),
        ],
      }),
      options
    );
    expect(
      chunks
        .filter(chunk => chunk.type === "accounting")
        .map(chunk => chunk.record.amount)
    ).toEqual([75, -12, 200, -10]);
    expect(chunks.filter(chunk => chunk.type === "payment")).toHaveLength(4);
  });

  it("does not create a payment for ordinary accounting", () => {
    expect(transformKxxRecord(record(), options)).toEqual([
      {
        type: "accounting",
        record: {
          ...options,
          type: "UCT",
          paragraph: 3613,
          item: 6121,
          unit: 2,
          event: 161,
          amount: 100,
        },
      },
    ]);
  });
});
