import { parseXml } from 'libxmljs'

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

// The type definitions for libxmljs are incomplete (a sometimes wrong 🤦‍♂️).
declare module 'libxmljs' {
    interface Document {
        find(xpath: string, ns: string): Element[]
    }
}
