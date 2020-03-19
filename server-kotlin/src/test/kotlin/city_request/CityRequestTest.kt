package city_request

import digital.cesko.city_request.CityRequest
import main.AbstractSpringTest
import org.assertj.core.api.Assertions.assertThat
import kotlin.test.Test

class CityRequestTest : AbstractSpringTest() {

    @Test
    fun `Should add to sheet`() {
        val result = post("/api/v2/service/cityrequest",
                payload = CityRequest(
                        city = "Humpolec",
                        email = "starosta@humpolec.cz",
                        name = "Pan Starosta",
                        subscribe = true,
                        gdpr = true
                )
        ).andReturn()
        assertThat(result.response.status).isEqualTo(200)
        assertThat(result.response.contentAsString).isEqualTo("ok")
    }
}
