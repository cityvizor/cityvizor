package digital.cesko.internet_stream

import java.math.BigDecimal
import java.time.LocalDate

data class Budget(
        val type: String,
        val paragraph: Int,
        val item: Int,
        val srcId: String,
        val name: String,
        val amount: BigDecimal,
        val event: Long?,
        val unit: Int?,
        val date: LocalDate?,
        val counterpartyId: String?,
        val counterpartyName: String?,
        val description: String?,
        val year: Int?
)