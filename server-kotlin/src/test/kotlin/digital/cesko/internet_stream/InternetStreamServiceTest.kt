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
            val result = Payments.select { Payments.year eq 2020 }.toList()
            assertEquals(20, result[0][Payments.profileId])
            assertEquals(2020, result[0][Payments.year])
            assertEquals(5512, result[0][Payments.paragraph])
            assertEquals(5154, result[0][Payments.item])
            assertEquals(5512000000001, result[0][Payments.event])
            assertEquals(BigDecimal("13660.00"), result[0][Payments.amount])

            assertEquals(BigDecimal("4779.00"), result[1][Payments.amount])
        }
    }
}
