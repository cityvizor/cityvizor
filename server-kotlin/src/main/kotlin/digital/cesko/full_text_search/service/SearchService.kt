package digital.cesko.full_text_search.service

import digital.cesko.city_search.CitySearchIndex
import digital.cesko.full_text_search.model.SearchResult
import org.apache.lucene.index.DirectoryReader
import org.apache.lucene.index.IndexReader
import org.apache.lucene.index.Term
import org.apache.lucene.search.BooleanClause
import org.apache.lucene.search.BooleanQuery
import org.apache.lucene.search.IndexSearcher
import org.apache.lucene.search.WildcardQuery
import org.apache.lucene.store.Directory
import org.apache.lucene.store.MMapDirectory
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import java.nio.file.Files

const val CONTRACT_TITLE = "title"
const val CONTRACT_COUNTERPARTY = "counterparty"
const val CONTRACT_PROFILE = "profile"
const val CONTRACT_ID = "id"
const val MAX_SIZE = 30

object SearchService {
    val directory = MMapDirectory(Files.createTempDirectory("search-index"))

    init {
        ImporterService(directory = directory).import()
    }

    fun search(query: String, profile: String?): List<SearchResult> {
        val contractCounterParty = WildcardQuery(Term(CONTRACT_COUNTERPARTY, "$query*".toLowerCase()))
        val contractTitle = WildcardQuery(Term(CONTRACT_TITLE, "$query*".toLowerCase()))

        val chainQueryBuilderForFulltext = BooleanQuery.Builder()
        chainQueryBuilderForFulltext.add(contractCounterParty, BooleanClause.Occur.SHOULD)
        chainQueryBuilderForFulltext.add(contractTitle, BooleanClause.Occur.SHOULD)

        val finalQuery = chainQueryBuilderForFulltext.build()
        val indexReader: IndexReader = DirectoryReader.open(directory)
        val searcher = IndexSearcher(indexReader)
        val topDocs = searcher.search(finalQuery, MAX_SIZE)
        val mapped = topDocs.scoreDocs.map {
            val doc = searcher.doc(it.doc)
            val result = SearchResult(
                id = doc.get(CONTRACT_ID),
                profile = doc.get(CONTRACT_PROFILE),
                title = doc.get(CONTRACT_TITLE),
                counterparty = doc.get(CONTRACT_COUNTERPARTY)
            )
            result
        }
        return if (profile == null) mapped else mapped.filter { it.profile == profile }
    }
}