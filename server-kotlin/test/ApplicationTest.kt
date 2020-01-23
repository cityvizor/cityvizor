package digital.cesko

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import digital.cesko.city_request.CityRequest
import io.ktor.http.*
import kotlin.test.*
import io.ktor.server.testing.*
import main.module

class ApplicationTest {

    private val mapper by lazy { jacksonObjectMapper() }

    @Test
    fun testCityRequest() {
        withTestApplication({ module(testing = true) }) {
            handleRequest(HttpMethod.Post, "/api/v2/service/cityrequest") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                setBody(mapper.writeValueAsBytes(CityRequest(
                    city = "Humpolec",
                    email = "starosta@humpolec.cz",
                    name = "Pan Starosta",
                    subscribe = true,
                    gdpr = true
                )) )
            }.apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertEquals("sent", response.content)
            }
        }
    }
}
