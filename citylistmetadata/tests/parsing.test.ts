import { parseXml } from 'libxmljs'
import { parseSubjekt, namespace } from '../src/parsing'
import { readFileSync } from "fs";

// The type definitions for libxmljs are incomplete (a sometimes wrong 🤦‍♂️).
declare module 'libxmljs' {
    interface Document {
        find(xpath: string, ns: string): Element[]
    }
}

const parseXmlFile = (filename: string) =>
    parseXml(readFileSync(filename).toString())
const parseFixture = (basename: string) =>
    parseXmlFile(`tests/fixtures/${basename}`)

test('Parse single subject', () => {
    const doc = parseFixture("boskovice.xml")
    const subjekt = parseSubjekt(doc.find('//xmlns:Subjekt', namespace)[0])
    expect(subjekt).toEqual({
        zkratka: "Boskovice",
        ICO: "00279978",
        nazev: "Město Boskovice",
        datovaSchrankaID: "qmkbq7h",
        mail: ['mu@boskovice.cz', 'epodatelna@boskovice.cz'],
        pravniForma: {
            'type': 801,
            'label': 'Obec'
        },
        adresaUradu: {
            PSC: "68001",
            adresniBod: "15259641",
            castObce: "Boskovice",
            cisloDomovni: "4",
            cisloOrientacni: "2",
            kraj: "Jihomoravský",
            obec: "Boskovice",
            obecKod: "581372",
            ulice: "Masarykovo náměstí",
        },
    })
})

// Skipped, as the fixture with all subjects is big (~20 M) and not a part
// of the repo. Download & delete the “skip” marker to run.
test.skip('Parse all subjects', () => {
    const doc = parseFixture("all.xml")
    const subjects = doc.find('//xmlns:Subjekt', namespace).map(parseSubjekt)
    expect(subjects.length).toBe(17403)
    expect(subjects.filter(x => x != null).length).toBe(17280)
})