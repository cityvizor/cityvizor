import { Element } from 'libxmljs'

export const namespace = "http://www.czechpoint.cz/spravadat/p/ovm/datafile/seznamovm/v1"

export interface Adresa {
    ulice: string | null
    cisloDomovni: string | null
    cisloOrientacni: string | null
    obec: string | null
    obecKod: string | null
    PSC: string | null
    castObce: string | null
    kraj: string | null
    adresniBod: string | null
}

export interface PravniForma {
    type: number
    label: string
}

export interface Subjekt {
    zkratka: string
    ICO: string | null
    nazev: string
    datovaSchrankaID: string | null
    pravniForma: PravniForma
    mail: string[]
    adresaUradu: Adresa | null
}

export function parseSubjekt(elem: Element): Subjekt | null {

    const zkratka = parseChildAttValue(elem, "Zkratka")
    const nazev = parseChildAttValue(elem, "Nazev")
    const pravniForma = map(getFirstChildElem(elem, "PravniForma"), parsePravniForma)

    if (zkratka == null || nazev == null || pravniForma == null) {
        return null
    }

    const ICO = parseChildAttValue(elem, "ICO")
    const datovaSchrankaID = parseChildAttValue(elem, "IdDS")
    const mail = parseEmails(elem)
    const adresaUradu = map(getFirstChildElem(elem, "AdresaUradu"), parseAdresa)

    return {
        'zkratka': zkratka,
        'ICO': ICO,
        'nazev': nazev,
        'datovaSchrankaID': datovaSchrankaID,
        'pravniForma': pravniForma,
        'mail': mail,
        'adresaUradu': adresaUradu,
    }
}

function parsePravniForma(elem: Element): PravniForma | null {
    const type = elem.attr("type")?.value()
    const label = elem.text()
    if (type == null || label == null) {
        return null
    }
    return {
        "type": parseInt(type),
        "label": label
    }
}

function parseAdresa(elem: Element): Adresa | null {
    const parse = (name: string) => parseChildAttValue(elem, name)
    return {
        ulice: parse("UliceNazev"),
        cisloDomovni: parse("CisloDomovni"),
        cisloOrientacni: parse("CisloOrientacni"),
        obec: parse("ObecNazev"),
        obecKod: parse("ObecKod"),
        PSC: parse("PSC"),
        castObce: parse("CastObceNeboKatastralniUzemi"),
        kraj: parse("KrajNazev"),
        adresniBod: parse("AdresniBod")
    }
}

function parseEmails(elem: Element): string[] {
    const elems = elem.find('xmlns:Email/xmlns:Polozka/xmlns:Email', namespace)
    return elems.map(e => (e as Element).text())
}

function parseChildAttValue(elem: Element, childName: string): string | null {
    const child = getFirstChildElem(elem, childName)
    return (child != null) ? child.text() : null
}

function getFirstChildElem(elem: Element, childName: string): Element | null {
    const child = elem.find(`xmlns:${childName}`, namespace)[0]
    if (child?.type() === "element") {
        return child as Element
    } else {
        return null
    }
}

function map<T, U>(value: T | null, f: (_: T) => U): U | null {
    if (value != null) {
        return f(value)
    } else {
        return null
    }
}