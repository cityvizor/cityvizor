package digital.cesko.internet_stream

import digital.cesko.AbstractSpringDatabaseTest
import digital.cesko.common.Payments
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.ActiveProfiles
import java.math.BigDecimal
import kotlin.test.assertEquals

@ActiveProfiles("internetstream")
class InternetStreamServiceTest : AbstractSpringDatabaseTest() {
    @Autowired
    private lateinit var internetStreamService: InternetStreamService

    @Test
    fun fetchBudgets() {
        internetStreamService.fetchData()
        transaction {
            val result = Payments.select { Payments.year eq 2020 }.first()

            assertEquals(20, result[Payments.profileId])
            assertEquals(2020, result[Payments.year])
            assertEquals(6171, result[Payments.paragraph])
            assertEquals(5031, result[Payments.item])
            assertEquals(6171170000001, result[Payments.event])
            assertEquals(BigDecimal("516230.00"), result[Payments.amount])
        }
    }
}
