package digital.cesko.full_text_search.model

data class SearchResult(
        val id: String,
        val profile: String,
        val date: String,
        val title: String,
        val counterparty: String,
        val amount: Long?,
        val currency: String?,
        val url: String?
)
