package digital.cesko.city_request

import digital.cesko.AbstractKtorTest
import digital.cesko.sendRequest
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import kotlin.test.Test
import kotlin.test.assertEquals

class CityRequestTest : AbstractKtorTest() {

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
