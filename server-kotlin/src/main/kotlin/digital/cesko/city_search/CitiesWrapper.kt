package digital.cesko.city_search

import com.fasterxml.jackson.annotation.JsonProperty

data class CitiesWrapper(
    @get:JsonProperty("municipalities")
    val municipalities: List<City>
)
