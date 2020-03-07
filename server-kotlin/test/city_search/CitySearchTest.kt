package digital.cesko.city_search

import digital.cesko.runTest
import digital.cesko.sendRequest
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson
import kotlin.test.Test
import kotlin.test.assertEquals

class CitySearchTest {

    @Test
    fun testCitySearch() {
        runTest {
            sendRequest(HttpMethod.Get, "/api/v2/service/citysearch?query=jilove+u+prahy").apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertThatJson(response.content!!).inPath("\$.[?(@.ico=='00241326')]").isNotNull()
            }
        }
    }
}
