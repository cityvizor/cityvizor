// Minimální účetní věta: doklad 100001, paragraf 6310, položka 5163,
// ORG 161, částka DAL 28,20 Kč. Rozložení pevných polí zůstává doslovné.
export const kxxAccountingLine =
  "G/@01   100001000231001000006310516300000000000000000000001610000000000000000000000000000 000000000000002820 ";

export function kxxSource(type: number, organization = "44992785"): string {
  return [
    "5/@44992785160003000MBMC",
    `6/@${organization}1601${String(type).padStart(2, "0")} 2 2026`,
    kxxAccountingLine,
    ...(type === 0
      ? [
          "G/#0001   100001*EVK-KDF-2026001;*IC-00123456;*DICT-Dodavatel;*EVKT-Bankovní služba;",
        ]
      : []),
    "",
  ].join("\n");
}
