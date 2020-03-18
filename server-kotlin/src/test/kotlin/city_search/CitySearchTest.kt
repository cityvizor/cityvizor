package city_search

import main.AbstractSpringTest
import net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson
import org.assertj.core.api.Assertions.assertThat
import org.springframework.test.web.servlet.get
import kotlin.test.Test

class CitySearchTest : AbstractSpringTest() {

    @Test
    fun testCitySearch() {
        val result = mockMvc.get("/api/v2/service/citysearch?query=jilove+u+prahy").andReturn()
        assertThat(result.response.status).isEqualTo(200)
        assertThatJson(result.response.contentAsString).inPath("\$.[?(@.ico=='00241326')]").isNotNull()
    }

    @Test
    fun testSearchKnownCity() {
        val result = mockMvc.get("/api/v2/service/citysearch?query=Cernosice").andReturn()
        assertThat(result.response.status).isEqualTo(200)
        assertThatJson(result.response.contentAsString).node("[0]").isEqualTo(
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

    @Test
    fun testSearchPraha() {
        val result = mockMvc.get("/api/v2/service/citysearch?query=Praha 1").andReturn()
        assertThat(result.response.status).isEqualTo(200)
        assertThatJson(result.response.contentAsString).node("[0].ICO").isString().isEqualTo("00063410")
    }
}
