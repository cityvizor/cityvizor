package digital.cesko.full_text_search.model

import java.time.LocalDate

data class SearchResult(
        val id: String,
        val profile: String,
//        val date: LocalDate,
//        val type: String,
        val title: String,
        val counterparty: String
//        val amount: String,
//        val currency: String,
//        val url: String
)
