package full_text_search.service

import full_text_search.memoryIndex
import full_text_search.model.InvoiceLucineModel
import org.apache.lucene.index.DirectoryReader
import org.apache.lucene.index.IndexReader
import org.apache.lucene.index.Term
import org.apache.lucene.search.BooleanClause
import org.apache.lucene.search.BooleanQuery
import org.apache.lucene.search.IndexSearcher
import org.apache.lucene.search.WildcardQuery

const val MAX_SIZE = 10_000

fun search(query: String, profile: String?): List<InvoiceLucineModel> {
    val counterpartyIdQuery = WildcardQuery(Term(COUNTERPARTY_ID, "$query*".toLowerCase()))
    val counterpartyNameQuery = WildcardQuery(Term(COUNTERPARTY_NAME, "$query*".toLowerCase()))
    val descriptionQuery = WildcardQuery(Term(DESCRIPTION, "$query*".toLowerCase()))
    val chainQueryBuilderForFulltext = BooleanQuery.Builder()
    chainQueryBuilderForFulltext.add(counterpartyIdQuery, BooleanClause.Occur.SHOULD)
    chainQueryBuilderForFulltext.add(counterpartyNameQuery, BooleanClause.Occur.SHOULD)
    chainQueryBuilderForFulltext.add(descriptionQuery, BooleanClause.Occur.SHOULD)
    val finalQuery = chainQueryBuilderForFulltext.build()
    val indexReader: IndexReader = DirectoryReader.open(memoryIndex)
    val searcher = IndexSearcher(indexReader)
    val topDocs = searcher.search(finalQuery, MAX_SIZE)
    val mapped = topDocs.scoreDocs.map {
        val doc = searcher.doc(it.doc)
        val result = InvoiceLucineModel(
            id = doc.get(ID).toInt(),
            profile = doc.get(PROFILE),
            description = doc.get(DESCRIPTION),
            counterPartyId = doc.get(COUNTERPARTY_ID),
            counterPartyName = doc.get(COUNTERPARTY_NAME)
        )
        result
    }
    return if (profile == null) mapped else mapped.filter { it.profile == profile }
}
