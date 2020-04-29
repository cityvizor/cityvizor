package digital.cesko.full_text_search.service

import digital.cesko.common.Contracts
import org.apache.lucene.analysis.standard.StandardAnalyzer
import org.apache.lucene.document.Document
import org.apache.lucene.document.Field
import org.apache.lucene.document.TextField
import org.apache.lucene.index.IndexWriter
import org.apache.lucene.index.IndexWriterConfig
import org.apache.lucene.store.Directory
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Service

class ImporterService(
        private val directory: Directory
) {
    fun import() {
        val analyzer = StandardAnalyzer()
        val indexWriterConfig = IndexWriterConfig(analyzer)
        val writer = IndexWriter(directory, indexWriterConfig)

        writer.use {
            transaction {
                Contracts.selectAll().map {
                    val document = Document()
                    document.add(TextField(CONTRACT_ID, it[Contracts.id].toString(), Field.Store.YES))
                    document.add(TextField(CONTRACT_TITLE, it[Contracts.title], Field.Store.YES))
                    document.add(TextField(CONTRACT_PROFILE, it[Contracts.profileId].toString(), Field.Store.YES))
                    document.add(TextField(CONTRACT_COUNTERPARTY, it[Contracts.counterparty], Field.Store.YES))

                    document
                }.forEach {
                    writer.addDocument(it)
                }
            }
        }
    }
}
