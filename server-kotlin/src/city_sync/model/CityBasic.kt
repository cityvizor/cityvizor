package digital.cesko.city_sync.model

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class CityBasic(
    val id: Int,
    val name: String?,
    val ico: String?
)