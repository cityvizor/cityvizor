package digital.cesko.city_request

import digital.cesko.AbstractSpringDatabaseTest
import kotlin.test.Test

class CityRequestTest : AbstractSpringDatabaseTest() {

    @Test
    fun `Should add to sheet`() {
        post("/api/v2/service/cityrequest",
                payload = CityRequest(
                        city = "Humpolec",
                        psc = "000000",
                        email = "starosta@humpolec.cz",
                        name = "Pan Starosta",
                        subscribe = true,
                        gdpr = true,
                        occupation = "Yes"
                )
        ).andExpect {
            status { isOk }
            content { string("ok") }
        }
    }
}
