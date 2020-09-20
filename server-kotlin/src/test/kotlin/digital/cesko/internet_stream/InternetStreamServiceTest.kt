package digital.cesko.internet_stream

import digital.cesko.AbstractSpringDatabaseTest
import digital.cesko.common.Payments
import org.apache.catalina.webresources.TomcatURLStreamHandlerFactory
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import kotlin.test.assertEquals

class InternetStreamServiceTest : AbstractSpringDatabaseTest() {
    init {
        // This has to be present in order to recognize classpath protocol
        TomcatURLStreamHandlerFactory.getInstance()
    }

    @Autowired
    private lateinit var internetStreamService: InternetStreamService

    @Test
    fun fetchBudgets() {
        internetStreamService.fetchData()
        val result: ResultRow = transaction {
            Payments.select { Payments.year eq 2012 }.first()
        }

        val map = result.toString()
                .split(",")
                .map { it.trim() }
                .map { it.split("=") }
                .map { it.first() to it.last() }
                .toMap()

        assertEquals(20, map["digital.cesko.common.Payments.profile_id"]?.toInt())
        assertEquals(2012, map["digital.cesko.common.Payments.year"]?.toInt())
        assertEquals(2310, map["digital.cesko.common.Payments.paragraph"]?.toInt())
        assertEquals(5329, map["digital.cesko.common.Payments.item"]?.toInt())
        assertEquals(100, map["digital.cesko.common.Payments.event"]?.toInt())
        assertEquals("1036700.00", map["digital.cesko.common.Payments.amount"])
    }
}