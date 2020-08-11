package digital.cesko.full_text_search.model

import digital.cesko.full_text_search.service.CONTRACT_AMOUNT
import digital.cesko.full_text_search.service.CONTRACT_COUNTERPARTY
import digital.cesko.full_text_search.service.CONTRACT_CURRENCY
import digital.cesko.full_text_search.service.CONTRACT_DATE
import digital.cesko.full_text_search.service.CONTRACT_ID
import digital.cesko.full_text_search.service.CONTRACT_PROFILE
import digital.cesko.full_text_search.service.CONTRACT_TITLE
import digital.cesko.full_text_search.service.CONTRACT_URL
import org.apache.lucene.document.Document

data class SearchResult(
    val id: String,
    val profile: String,
    val date: String,
    val title: String,
    val counterparty: String,
    val amount: Long?,
    val currency: String?,
    val url: String?
) {
    constructor(doc: Document) : this(
        doc.get(CONTRACT_ID),
        doc.get(CONTRACT_PROFILE),
        doc.get(CONTRACT_DATE),
        doc.get(CONTRACT_TITLE),
        doc.get(CONTRACT_COUNTERPARTY),
        doc.get(CONTRACT_AMOUNT)?.toLong(),
        doc.get(CONTRACT_CURRENCY),
        doc.get(CONTRACT_URL)
    )
}
