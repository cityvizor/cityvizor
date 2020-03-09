package digital.cesko.city_sync

import digital.cesko.AbstractKtorTest
import digital.cesko.sendRequest
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson
import kotlin.test.Test
import kotlin.test.assertEquals

class CitySyncTest : AbstractKtorTest() {
    @Test
    fun `Should list cities`() {
        runTest {
            sendRequest(HttpMethod.Get, "/api/v1/citysync/cities").apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertThatJson(response.content!!).isArray().contains("""{"id" : 6, "name" : "Praha 3", "ico" : "00063517"}""")
            }
        }
    }
}
