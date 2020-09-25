package digital.cesko.internet_stream

import digital.cesko.AbstractSpringDatabaseTest
import digital.cesko.common.Payments
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import java.math.BigDecimal
import kotlin.test.assertEquals

class InternetStreamServiceTest : AbstractSpringDatabaseTest() {
    @Autowired
    private lateinit var internetStreamService: InternetStreamService

    @Test
    fun fetchBudgets() {
        internetStreamService.fetchData()
        transaction {
            val result = Payments.select { Payments.year eq 2012 }.first()

            assertEquals(20, result[Payments.profileId])
            assertEquals(2012, result[Payments.year])
            assertEquals(2310, result[Payments.paragraph])
            assertEquals(5329, result[Payments.item])
            assertEquals(100, result[Payments.event])
            assertEquals(BigDecimal("1036700.00"), result[Payments.amount])
        }
    }
}
