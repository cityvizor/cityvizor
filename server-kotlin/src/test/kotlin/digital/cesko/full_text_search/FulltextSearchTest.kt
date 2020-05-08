package digital.cesko.full_text_search

import digital.cesko.AbstractSpringTest
import net.javacrumbs.jsonunit.spring.jsonContent
import org.junit.Test

class FulltextSearchTest : AbstractSpringTest() {

    @Test
    fun testSearchCounterParty() {
        get("/api/v2/search?query=unius").andExpect {
            status { isOk }
            jsonContent {
                inPath("\$.[?(@.id=='10312')]").isNotNull()
            }
        }
    }

    @Test
    fun testSearchTitle() {
        get("/api/v2/search?query=realizace").andExpect {
            status { isOk }
            jsonContent {
                inPath("\$.[?(@.id=='10314')]").isNotNull()
            }
        }
    }

    @Test
    fun testSearchNoResults() {
        get("/api/v2/search?query=xyz").andExpect {
            status { isOk }
            jsonContent {
                inPath("\$").isArray().isEmpty()
            }
        }
    }
}
