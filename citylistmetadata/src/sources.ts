import { Subjekt } from './types'
import { writeFileSync, readFileSync } from 'fs'

export interface DataSource<T> {
    id: string
    fetch: (_: Subjekt) => Promise<T | null>
}

type Cache = {
    [key: string]: any
}

export async function addExtraData(subjects: Subjekt[], sources: DataSource<Object>[]): Promise<Subjekt[]> {
    var out: Subjekt[] = []
    var cache: Cache = loadCache()
    for (var subject of subjects) {
        const subjectId = subject.ICO || subject.nazev
        var subjectCache = cache[subjectId]
        if (subjectCache == null) {
            // The name of the subject is just a comment to make the cache file easier to read.
            subjectCache = { nazev: subject.nazev }
            cache[subjectId] = subjectCache
        }
        for (const source of sources) {
            subject = await addExtraDataToSubject(subject, source, subjectCache)
            // TODO: Perhaps we should only write the cache every _n_ items?
            // TODO: Or, in the best case, extract the caching logic to the top level.
            saveCache(cache)
        }
        out.push(subject)
    }
    return out
}

async function addExtraDataToSubject<T>(subject: Subjekt, dataSource: DataSource<T>, cache: Cache): Promise<Subjekt> {

    var value: T | null = null

    const key = dataSource.id
    const cachedValue = cache[key]
    const label = subject.ICO || subject.nazev || subject.zkratka

    if (cachedValue != null) {
        console.debug(`Cache hit for “${key}” of subject ${label}.`)
        value = cachedValue
    } else {
        console.debug(`Cache miss for “${key}” of subject ${label}, will try to get fresh data.`)
        // TODO: Retry?
        value = await dataSource.fetch(subject)
        if (value != null) {
            cache[key] = value
        }
    }

    return {
        [key]: value,
        ...subject
    }
}

function saveCache(cache: Cache) {
    const encoded = JSON.stringify(cache, null, 2)
    writeFileSync(`cache.json`, encoded)
}

function loadCache(): Cache {
    try {
        const encoded = readFileSync(`cache.json`).toString()
        return JSON.parse(encoded)
    } catch {
        return {}
    }
}
