package full_text_search.model

import org.joda.time.LocalDate


data class ResultModel(
    val invoices: List<InvoiceResultModel>
)

data class InvoiceResultModel(
    val id: Int,
    val profile: String,
    val year: Int,
    val event: String?,
    val eventSrcId: String?,
    val type: String,
    val item: Int,
    val paragraph: Int,
    val date: LocalDate,
    val amount: Double,
    val counterpartyId: Int?,
    val counterpartyName: String?,
    val description: String?
)

data class InvoiceLucineModel(
    val id: Int,
    val profile: String,
    val counterPartyId: String?,
    val counterPartyName: String?,
    val description: String?
)

data class ErrorModel(
    val message: String
)