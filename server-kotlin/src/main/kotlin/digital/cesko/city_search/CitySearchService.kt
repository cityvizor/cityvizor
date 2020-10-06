package digital.cesko.city_search

object CitySearchService {
    private val citySearchIndex = CitySearchIndex().apply { createCache() }

    private val imgBucket = System.getProperty("CITYVIZOR_IMAGES_URL")

    private val knownCities = mapOf(
        // Cernosice
        "00241121" to KnownCity("https://www.cityvizor.cz/cernosice/", "${imgBucket}cernosice.png"),
        // Marianske Lazne
        "00254061" to KnownCity("https://www.cityvizor.cz/marianskelazne/", "${imgBucket}marianskelazne.png"),
        // Nove Mesto na Morave
        "00294900" to KnownCity("https://www.cityvizor.cz/nmnm/", "${imgBucket}nmnm.png"),
        // Praha 1
        "00063410" to KnownCity("https://www.cityvizor.cz/praha1/", "${imgBucket}praha1.jpg"),
        // Praha 3
        "00063517" to KnownCity("https://www.cityvizor.cz/praha3/", "${imgBucket}praha3.png"),
        // Praha 7
        "00063754" to KnownCity("https://www.cityvizor.cz/praha7/", "${imgBucket}praha7.svg"),
        // Praha 12
        "00231151" to KnownCity("https://www.cityvizor.cz/praha12/", "${imgBucket}praha12.gif"),
        // Uhersky Brod
        "00291463" to KnownCity("https://www.cityvizor.cz/ub/", "${imgBucket}ub.png"),
        // Uvaly
        "00240931" to KnownCity("https://www.cityvizor.cz/uvaly/", "${imgBucket}uvaly.jpg")
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
