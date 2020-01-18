import { Document, Element } from 'libxmljs'
import { Subjekt, PravniForma, Adresa } from './types'

export const namespace = "http://www.czechpoint.cz/spravadat/p/ovm/datafile/seznamovm/v1"

export function parseAllValidSubjects(doc: Document): Subjekt[] {
    const subjects = doc.find('//xmlns:Subjekt', namespace).map(parseSubjekt)
    return subjects.filter(s => s != null) as Subjekt[]
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

/**
 * Normalize municipality name by stripping official prefix and fixing case.
 *
 * This is just a combination of `stripOfficialNamePrefix` and `normalizeTitleCase`.
 */
export function normalizeMunicipalityName(name: string): string {
    return normalizeTitleCase(stripOfficialNamePrefix(name))
}

/**
 * Strip the official name prefix such as “obec” or “městská část” from a municipality name.
 *
 * Also strips any whitespace after the prefix, ignores case when matching, does not touch anything else.
 */
export function stripOfficialNamePrefix(name: string): string {
    const prefixes = ['obec', 'město', 'městys', 'městská část', 'městský obvod', 'statutární město']
    const patterns = prefixes.map(p => RegExp(`^${p}\\s*`, "i"))
    patterns.forEach(p => name = name.replace(p, ""))
    return name
}

export function normalizeTitleCase(name: string): string {

    // Remove spaces around hyphens. According to the rules of Czech typography,
    // spaces should only be used around a regular dash (–), not hyphen (-). We
    // are assuming that all hyphens in the source data set are really hyphens,
    // ie. “Rájec - Jestřebí” really means “Rájec-Jestřebí”.
    const fixHyphens = (s: string) => s.replace(/\s*-\s*/, "-")

    return fixHyphens(name)
        .split(" ")
        .map(titleCaseWord)
        .join(" ")
}

function titleCaseWord(word: string): string {

    const prepositions = ['v', 'nad', 'pod', 'u', 'na', 'při', 'mezi', 'a']
    const exceptions = ['horách', 'lesy', 'horou']

    const keepLowercase = (s: string) =>
        prepositions.indexOf(s) != -1 ||
        exceptions.indexOf(s) != -1

    const upperCaseFirst = (s: string) =>
        s.charAt(0).toUpperCase() + s.slice(1)

    const transformCase = (s: string) => {
        s = s.toLowerCase()
        if (s === "" || keepLowercase(s)) {
            return s
        } else {
            return upperCaseFirst(s)
        }
    }

    return word.split("-").map(transformCase).join("-")
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