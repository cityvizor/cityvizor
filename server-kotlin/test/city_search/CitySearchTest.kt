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
                assertThatJson(response.content!!).node("[0]").isEqualTo(
                        """
                {
                   "adresaUradu":{
                      "adresniBod":"6506836",
                      "castObce":"Černošice",
                      "cisloDomovni":"259",
                      "kraj":"Středočeský",
                      "obecKod":"539139",
                      "obec":"Černošice",
                      "ulice":"Karlštejnská",
                      "castObce": "Černošice",
                      "cisloOrientacni": null,
                      "PSC":"25228"
                   
                    },
                    "datovaSchrankaID":"u46bwy4",
                    "mail": [
                      "podatelna@mestocernosice.cz"
                    ],
                    "nazev":"MĚSTO ČERNOŠICE",
                    "souradnice":[
                      49.95886668901324,
                      14.320428348540815
                    ],
                    "zkratka":"CERNOSICE",
                    "urlCityVizor":"https://www.cityvizor.cz/cernosice/",
                    "urlZnak":"https://www.cityvizor.cz/api/public/profiles/3/avatar",
                    "pocetObyvatel":0,
                    "eDeskyID":"139",
                    "ICO":"00241121"
                }    
                """.trimIndent())
            }
        }
    }

    @Test
    fun testSearchPraha() {
        runTest {
            sendRequest(HttpMethod.Get, "/api/v2/service/citysearch?query=Praha+1").apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertThatJson(response.content!!).node("[0].ICO").isString().isEqualTo("00063410")
            }
        }
    }
}
