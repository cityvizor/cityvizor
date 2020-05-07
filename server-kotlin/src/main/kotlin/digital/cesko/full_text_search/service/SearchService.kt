package digital.cesko.full_text_search.service

import digital.cesko.full_text_search.model.SearchResult
import org.apache.lucene.document.IntPoint
import org.apache.lucene.index.DirectoryReader
import org.apache.lucene.index.Term
import org.apache.lucene.search.BooleanClause
import org.apache.lucene.search.BooleanQuery
import org.apache.lucene.search.IndexSearcher
import org.apache.lucene.search.WildcardQuery
import org.apache.lucene.store.Directory
import org.springframework.beans.factory.config.ConfigurableBeanFactory
import org.springframework.context.annotation.Scope
import org.springframework.stereotype.Service


const val CONTRACT_TITLE = "title"
const val CONTRACT_COUNTERPARTY = "counterparty"
const val CONTRACT_AMOUNT = "amount"
const val CONTRACT_CURRENCY = "currency"
const val CONTRACT_URL = "url"
const val CONTRACT_PROFILE = "profile"
const val CONTRACT_DATE = "date"
const val CONTRACT_ID = "id"
const val MAX_SIZE = 30

@Service
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
class SearchService(
        private var directory: Directory
) {
    fun countById(contractId: Int): Int {
        val searcher = IndexSearcher(DirectoryReader.open(directory))
        return searcher.count(IntPoint.newExactQuery(CONTRACT_ID, contractId))
    }

    fun search(stringQuery: String, profile: String?): List<SearchResult> {
        val contractCounterParty = WildcardQuery(Term(CONTRACT_COUNTERPARTY, "$stringQuery*".toLowerCase()))
        val contractTitle = WildcardQuery(Term(CONTRACT_TITLE, "$stringQuery*".toLowerCase()))

        val chainQueryBuilderForFulltext = BooleanQuery.Builder()
        chainQueryBuilderForFulltext.add(contractCounterParty, BooleanClause.Occur.SHOULD)
        chainQueryBuilderForFulltext.add(contractTitle, BooleanClause.Occur.SHOULD)

        val finalQuery = chainQueryBuilderForFulltext.build()
        val searcher = IndexSearcher(DirectoryReader.open(directory))
        val topDocs = searcher.search(finalQuery, MAX_SIZE)
        val mapped = topDocs.scoreDocs.map {
            val doc = searcher.doc(it.doc)
            val result = SearchResult(
                    id = doc.get(CONTRACT_ID),
                    profile = doc.get(CONTRACT_PROFILE),
                    title = doc.get(CONTRACT_TITLE),
                    counterparty = doc.get(CONTRACT_COUNTERPARTY),
                    amount = doc.get(CONTRACT_AMOUNT)?.toLong(),
                    date = doc.get(CONTRACT_DATE),
                    currency = doc.get(CONTRACT_CURRENCY),
                    url = doc.get(CONTRACT_URL)
            )
            result
        }
        return if (profile == null) mapped else mapped.filter { it.profile == profile }
    }
}