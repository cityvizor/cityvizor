package digital.cesko.city_sync



import com.fasterxml.jackson.module.kotlin.readValue
import digital.cesko.AbstractSpringDatabaseTest
import digital.cesko.city_sync.model.SyncResponse
import digital.cesko.city_sync.model.SyncTask
import net.jadler.Jadler
import net.jadler.Jadler.onRequest
import net.jadler.stubbing.server.jdk.JdkStubHttpServer
import net.javacrumbs.jsonunit.spring.jsonContent
import org.springframework.http.MediaType.APPLICATION_JSON_VALUE
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test

class CitySyncTest : AbstractSpringDatabaseTest() {
    @Test
    fun `Should list cities`() {
        get("/api/v1/citysync/cities").andExpect {
            status { isOk }
            jsonContent {
                isArray.contains("""{"id" : 6, "name" : "Praha 3", "ico" : "00063517"}""")
            }
        }
    }

    @Test
    fun `Should fetch city`() {
        get("/api/v1/citysync/cities/6").andExpect {
            status { isOk }
        }
    }

    @Test
    fun `Should sync cities`() {
        onRequest()
            .havingMethodEqualTo("GET")
            .havingPathEqualTo("/api/v1/citysync/cities/0")
            .respond()
            .withBody(testCityData)
            .withContentType(APPLICATION_JSON_VALUE)


        val result = post(
            "/api/v1/citysync/synchronization",
            payload = SyncTask("test", 0)
        )
            .andExpect { status { isCreated } }
            .andReturn()
        val syncResponse = objectMapper.readValue<SyncResponse>(result.response.contentAsString)

        get("/api/v1/citysync/cities/${syncResponse.profileId}").andExpect {
            status {
                isOk
            }
            jsonContent {
                whenIgnoringPaths("id", "contracts[*].id").isEqualTo(testCityData)
            }
        }
    }

    @BeforeTest
    fun setUp() {
        Jadler.initJadlerUsing(JdkStubHttpServer(8765))
    }

    @AfterTest
    fun tearDown() {
        Jadler.closeJadler()
    }

    val testCityData = """
        {
          "id": 0,
          "status": "pending",
          "url": "test_city",
          "name": "Test City",
          "email": null,
          "ico": "00000000",
          "dataBox": null,
          "mapaSamospravy": null,
          "gpsX": 14.47040400000000000000000000000000000000,
          "gpsY": 50.08442600000000000000000000000000000000,
          "main": false,
          "avatarType": ".png",
          "tokenCode": 0,
          "accounting": [
          ],
          "contracts": [
            {
              "id": 10296,
              "date": "2019-11-15",
              "title": "Jménem MČ Praha 3 objednáváme na základě Vaší cenové nabídky ze dne 7.11.2019 instalaci zimních tabulek v počtu 234 ks,  průběžné doplňování při poškození a zničení - fakturace bude dle skutečného množství.  A jejich odstranění na konci zimního období do",
              "counterparty": "SANKOL, zahradnická s.r.o.",
              "amount": 76235.00,
              "currency": "CZK",
              "url": "https://smlouvy.gov.cz/smlouva/10752452"
            }
          ],
          "years": [
          ],
          "events": [
          ],
          "noticeboards": [
            {
              "date": "2019-12-06",
              "title": "EX 2353/19-44 ZDN,45 ZZDV",
              "category": null,
              "documentUrl": "https://www.praha3.cz/eDeska/eDeskaDetail.jsp?detailId=21143",
              "edeskyUrl": "https://edesky.cz/dokument/3451312",
              "previewUrl": "https://edesky.cz/dokument/3451312.txt",
              "attachments": 1
            }
          ],
          "payments": [
          ],
          "eDesky": 115
        }
    """
}
