package digital.cesko.internet_stream

import java.math.BigDecimal
import java.time.LocalDate

data class Budget(
        val type: String,
        val paragraph: Int,
        val item: Int,
        val src_id: String,
        val name: String,
        val amount: BigDecimal,
        val event: Int?,
        val unit: Int?,
        val date: LocalDate?,
        val counterparty_id: String?,
        val counterparty_name: String?,
        val description: String?
)