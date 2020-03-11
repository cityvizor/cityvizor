package digital.cesko.city_search

import city_search.City

object CitySearchService {
    private val citySearchIndex = CitySearchIndex().apply { createCache() }

    private val knownCities = mapOf(
            // Cernosice
            "00241121" to KnownCity("https://www.cityvizor.cz/cernosice/", "https://www.cityvizor.cz/api/public/profiles/3/avatar"),
            // Marianske Lazne
            "00254061" to KnownCity("https://www.cityvizor.cz/marianskelazne/", "https://www.cityvizor.cz/api/public/profiles/31/avatar"),
            // Nove Mesto na Morave
            "00294900" to KnownCity("https://www.cityvizor.cz/nmnm/", "https://www.cityvizor.cz/api/public/profiles/1/avatar"),
            // Praha 1
            "00063410" to KnownCity("https://www.cityvizor.cz/praha1/", "https://www.cityvizor.cz/api/public/profiles/21/avatar"),
            // Praha 3
            "00063517" to KnownCity("https://www.cityvizor.cz/praha3/", "https://www.cityvizor.cz/api/public/profiles/19/avatar"),
            // Praha 7
            "00063754" to KnownCity("https://www.cityvizor.cz/praha7/", "https://www.cityvizor.cz/api/public/profiles/4/avatar"),
            // Praha 12
            "00231151" to KnownCity("https://www.cityvizor.cz/praha7/", "https://www.cityvizor.cz/api/public/profiles/28/avatar"),
            // Uhersky Brod
            "00291463" to KnownCity("https://www.cityvizor.cz/ub/", "https://www.cityvizor.cz/api/public/profiles/8/avatar"),
            // Uvaly
            "00240931" to KnownCity("https://www.cityvizor.cz/uvaly/", "https://www.cityvizor.cz/api/public/profiles/9/avatar")
    )

    fun search(search: CitySearchIndex.Search): List<City> {
        return citySearchIndex.search(search.query)
                .sortedByDescending { it.pocetObyvatel }
                .take(30)
                .map {
                    val knownCity = knownCities.get(it.ico)
                    if (knownCity != null) {
                        it.copy(
                                urlCityVizor = knownCity.uriCityVizor,
                                urlZnak = knownCity.urlZnak
                        )
                    } else {
                        it
                    }
                }
    }

    fun update() = this.citySearchIndex.createCache()

    private data class KnownCity(val uriCityVizor: String, val urlZnak: String)
}

