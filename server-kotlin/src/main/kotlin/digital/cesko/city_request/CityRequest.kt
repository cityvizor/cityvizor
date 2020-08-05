package digital.cesko.city_request

import com.fasterxml.jackson.annotation.JsonProperty
import java.time.LocalDateTime

data class CityRequest(
    @JsonProperty("city")
    val city: String,

    @JsonProperty("PSC")
    val psc: String?,

    @JsonProperty("email")
    val email: String,

    @JsonProperty(value = "name", required = false)
    val name: String?,

    @JsonProperty("occupation", required = false)
    val occupation: String?,

    @JsonProperty("subscribe")
    val subscribe: Boolean,

    @JsonProperty("gdpr")
    val gdpr: Boolean
)
{
    var ip: String? = null
    var time: LocalDateTime? = null

    fun updateServerData(ip: String, time : LocalDateTime) : CityRequest
    {
        this.ip = ip
        this.time = time

        return this;
    }
}

