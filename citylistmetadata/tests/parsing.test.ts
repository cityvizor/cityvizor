import { parseXml } from 'libxmljs'
import { parseAllValidSubjects, normalizeTitleCase, stripOfficialNamePrefix, normalizeMunicipalityName } from '../src/parsing'
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

test('Normalize city name case', () => {
    expect(normalizeTitleCase('PEC POD SNĚŽKOU')).toBe('Pec pod Sněžkou')
    expect(normalizeTitleCase('KLÁŠTEREC NAD OHŘÍ')).toBe('Klášterec nad Ohří')
    expect(normalizeTitleCase('ROKYTNICE V ORLICKÝCH HORÁCH')).toBe('Rokytnice v Orlických horách')
    expect(normalizeTitleCase('KOSTELEC NAD ČERNÝMI LESY')).toBe('Kostelec nad Černými lesy')
    expect(normalizeTitleCase('ŽĎÁR NAD SÁZAVOU')).toBe('Žďár nad Sázavou')
    expect(normalizeTitleCase('FRYŠAVA POD ŽÁKOVOU HOROU')).toBe('Fryšava pod Žákovou horou')
    expect(normalizeTitleCase('PRAHA-ÚJEZD')).toBe('Praha-Újezd')
    expect(normalizeTitleCase('BRŤOV - JENEČ')).toBe('Brťov-Jeneč')
})

test('Strip official city name prefix', () => {
    expect(stripOfficialNamePrefix('MĚSTO HRONOV')).toBe('HRONOV')
    expect(stripOfficialNamePrefix('MĚSTYS Tištín')).toBe('Tištín')
    expect(stripOfficialNamePrefix('STATUTÁRNÍ MĚSTO LIBEREC')).toBe('LIBEREC')
})

test('Normalize municipality name', () => {
    expect(normalizeMunicipalityName('STATUTÁRNÍ MĚSTO LIBEREC')).toBe('Liberec')
    expect(normalizeMunicipalityName('Statutární město Frýdek-Místek')).toBe('Frýdek-Místek')
    expect(normalizeMunicipalityName('Městská část Brno Řečkovice a Mokrá Hora')).toBe('Brno Řečkovice a Mokrá Hora')
    expect(normalizeMunicipalityName('MĚSTO SVOBODA NAD ÚPOU')).toBe('Svoboda nad Úpou')
})