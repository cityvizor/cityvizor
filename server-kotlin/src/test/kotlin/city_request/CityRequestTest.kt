package city_request

import digital.cesko.city_request.CityRequest
import main.AbstractSpringTest
import org.assertj.core.api.Assertions.assertThat
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.post
import kotlin.test.Test

class CityRequestTest : AbstractSpringTest() {

    @Test
    fun testCityRequest() {
        val result = mockMvc.post("/api/v2/service/cityrequest") {
            content = CityRequest(
                    city = "Humpolec",
                    email = "starosta@humpolec.cz",
                    name = "Pan Starosta",
                    subscribe = true,
                    gdpr = true
            ).asJson()
            contentType = MediaType.APPLICATION_JSON
        }.andReturn()
        assertThat(result.response.status).isEqualTo(200)
        assertThat(result.response.contentAsString).isEqualTo("ok")
    }
}
