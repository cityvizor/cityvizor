package digital.cesko.full_text_search.service

import digital.cesko.common.AccentInsensitiveAnalyzer
import digital.cesko.full_text_search.model.SearchResult
import org.apache.lucene.document.IntPoint
import org.apache.lucene.index.DirectoryReader
import org.apache.lucene.queryparser.classic.MultiFieldQueryParser
import org.apache.lucene.search.IndexSearcher
import org.apache.lucene.search.SearcherManager
import org.apache.lucene.store.Directory
import org.springframework.beans.factory.annotation.Qualifier
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
class SearchService(
    @Qualifier("fulltextIndex") private val directory: Directory
) {
    private final val analyzer = AccentInsensitiveAnalyzer()
    private final val queryParser = MultiFieldQueryParser(arrayOf(CONTRACT_COUNTERPARTY, CONTRACT_TITLE), analyzer)
    private final val searcherManager: SearcherManager by lazy { SearcherManager(directory, null) }

    fun countById(contractId: Int): Int {
        val searcher = IndexSearcher(DirectoryReader.open(directory))
        return searcher.count(IntPoint.newExactQuery(CONTRACT_ID, contractId))
    }

    fun search(stringQuery: String, profile: String?): List<SearchResult> {
        val searcher = searcherManager.acquire()
        try {
            val split = stringQuery.split(" ").filter { it.isNotEmpty() }
            var hits = searcher.search(queryParser.parse("${split.joinToString(" AND ")}*"), MAX_SIZE)

            if (hits.totalHits.value == 0L) {
                hits = searcher.search(queryParser.parse(split.map { "$it~" }.joinToString(" AND ")), MAX_SIZE)
            }

            val mapped = hits.scoreDocs.map {
                SearchResult(searcher.doc(it.doc))
            }
            return if (profile == null) mapped else mapped.filter { it.profile == profile }
        } finally {
            searcherManager.release(searcher)
        }
    }

    internal fun refresh() {
        searcherManager.maybeRefresh()
    }
}
