package digital.cesko.city_search

import digital.cesko.AbstractKtorTest
import digital.cesko.sendRequest
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson
import kotlin.test.Test
import kotlin.test.assertEquals

class CitySearchTest : AbstractKtorTest() {

    @Test
    fun testCitySearch() {
        runTest {
            sendRequest(HttpMethod.Get, "/api/v2/service/citysearch?query=jilove+u+prahy").apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertThatJson(response.content!!).inPath("\$.[?(@.ico=='00241326')]").isNotNull()
            }
        }
    }

    @Test
    fun testSearchKnownCity() {
        runTest {
            sendRequest(HttpMethod.Get, "/api/v2/service/citysearch?query=Černošice").apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertThatJson(response.content!!).node("[0].ico").isEqualTo("\"00241121\"")
                assertThatJson(response.content!!).node("[0].urlCityVizor").isEqualTo("https://www.cityvizor.cz/cernosice/")
                assertThatJson(response.content!!).node("[0].urlZnak").isEqualTo("https://www.cityvizor.cz/api/public/profiles/3/avatar")
            }
        }
    }
}
