import { extractURLFromWikiAPIResponse, guessMunicipalityWikiPage, normalizeCOARecord, guessMunicipalityCOA } from '../src/coa';

const sampleResponse =
[
  "Boskovice",
  [
    "Boskovice"
  ],
  [
    "Boskovice (n\u011bmecky Boskowitz, v jidi\u0161 \u05d1\u05d5\u05e1\u05e7\u05d5\u05d5\u05d9\u05e6) jsou m\u011bsto v okrese Blansko v Jihomoravsk\u00e9m kraji, 14 km severn\u011b od Blanska a 33 km severn\u011b od Brna na hranic\u00edch Drahansk\u00e9 vrchoviny."
  ],
  [
    "https://cs.wikipedia.org/wiki/Boskovice"
  ]
]

test('Wikipedia URL extraction', () => {
  expect(extractURLFromWikiAPIResponse(sampleResponse)).toBe("https://cs.wikipedia.org/wiki/Boskovice");
  expect(extractURLFromWikiAPIResponse({})).toBe(null);
});

test('COA record matching', () => {
  expect(normalizeCOARecord("https://commons.wikimedia.org/wiki/File:%C4%8Celadn%C3%A1_CoA.svg")).toBe("%C4%8Celadn%C3%A1_CoA.svg")
});

test('Live example: Guess municipality Wiki page', async () => {
  const url = await guessMunicipalityWikiPage("Tábor");
  expect(url).toBe("https://cs.wikipedia.org/wiki/T%C3%A1bor");
});

test('Live example: Guess municipality COA', async () => {
  const coa = await guessMunicipalityCOA("Boskovice");
  expect(coa).toBe("https://commons.wikimedia.org/wiki/File:Boskovice_CoA_CZ.svg");
});
