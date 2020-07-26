package digital.cesko.full_text_search

import digital.cesko.AbstractSpringDatabaseTest
import digital.cesko.full_text_search.service.SearchService
import net.javacrumbs.jsonunit.spring.jsonContent
import org.apache.lucene.index.IndexNotFoundException
import org.awaitility.Awaitility.await
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class FulltextSearchTest : AbstractSpringDatabaseTest() {
    @Autowired
    private lateinit var searchService: SearchService


    @BeforeEach
    fun waitForIndex() {
        // Wait for indexing to finish
        await().until {
             try {
                 searchService.search("a", null)
                 true
             } catch (e: IndexNotFoundException) {
                 false
             }
        }
    }

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
        get("/api/v2/search?query=xyzxyz").andExpect {
            status { isOk }
            jsonContent {
                inPath("\$").isArray.isEmpty()
            }
        }
    }

    @Test
    fun testSearchProfileFilter() {
        get("/api/v2/search?query=servis&profile=4").andExpect {
            status { isOk }
            jsonContent {
                inPath("\$.[?(@.id=='10419')]").isArray.isNotEmpty
                inPath("\$.[?(@.id=='10361')]").isArray.isEmpty()
            }
        }
    }

    @Test
    fun testSearchMultiWord() {
        get("/api/v2/search?query=úprava+knižní+publikace").andExpect {
            status { isOk }
            jsonContent {
                inPath("\$.[?(@.id=='10419')]").isNotNull()
            }
        }
    }
}
