package digital.cesko.city_search

import city_search.City

object CitySearchService {
    private val citySearchIndex = CitySearchIndex().apply { createCache() }

    fun search(search: CitySearchIndex.Search): List<City> = citySearchIndex.search(search)

    fun update() = this.citySearchIndex.createCache()
}
