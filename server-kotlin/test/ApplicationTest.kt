package digital.cesko

import digital.cesko.city_request.CityRequest
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import kotlin.test.Test
import kotlin.test.assertEquals

class ApplicationTest {

    @Test
    fun testCityRequest() {
       runTest {
            sendRequest(HttpMethod.Post, "/api/v2/service/cityrequest", CityRequest(
                    city = "Humpolec",
                    email = "starosta@humpolec.cz",
                    name = "Pan Starosta",
                    subscribe = true,
                    gdpr = true
                )
            ).apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertEquals("ok", response.content)
            }
        }
    }
}
