package digital.cesko

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import digital.cesko.city_request.CityRequest
import io.ktor.config.MapApplicationConfig
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.TestApplicationEngine
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import main.module
import kotlin.test.Test
import kotlin.test.assertEquals

class ApplicationTest {

    private val mapper by lazy { jacksonObjectMapper() }

    @Test
    fun testCityRequest() {
       runTest {
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
                assertEquals("ok", response.content)
            }
        }
    }

    fun <R> runTest(test: TestApplicationEngine.() -> R): R {
        return withTestApplication({
            (environment.config as MapApplicationConfig).apply {
                put("ktor.database.jdbcUrl", "jdbc:h2:mem:test")
                put("ktor.database.driver", "org.h2.Driver")
                put("ktor.database.dbUser", "sa")
                put("ktor.database.dbPass", "")
            }
            module(testing = true)
        }, test)
    }
}
