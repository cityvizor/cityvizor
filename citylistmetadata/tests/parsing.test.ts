import { parseXml } from 'libxmljs'
import { parseAllValidSubjects } from '../src/parsing'
import { readFileSync } from "fs";

const parseFixture = (name: string) =>
    parseXml(readFileSync(`tests/fixtures/${name}`).toString())

test('Parse single subject', () => {
    const doc = parseFixture("boskovice.xml")
    const subjekt = parseAllValidSubjects(doc)[0]
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
