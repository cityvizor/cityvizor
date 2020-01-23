package digital.cesko.city_request

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

@JsonIgnoreProperties(ignoreUnknown = true)
data class CityRequest(
    @JsonProperty("city")
    val city: String,

    @JsonProperty("email")
    val email: String,

    @JsonProperty(value = "name", required = false)
    val name: String,

    @JsonProperty("subscribe")
    val subscribe: Boolean,

    @JsonProperty("gdpr")
    val gdpr: Boolean
) {
    override fun toString(): String {
        return "CityRequest(city='$city', email='$email', name='$name', subscribe=$subscribe, gdpr=$gdpr)"
    }
}
