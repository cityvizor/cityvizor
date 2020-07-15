package digital.cesko.full_text_search.service

import digital.cesko.common.Contracts
import org.apache.lucene.analysis.standard.StandardAnalyzer
import org.apache.lucene.document.*
import org.apache.lucene.index.IndexWriter
import org.apache.lucene.index.IndexWriterConfig
import org.apache.lucene.store.Directory
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.format.DateTimeFormatter
import java.util.logging.Logger

@Service
@ConditionalOnProperty("fulltextSearch.indexRefreshEnabled")
class IndexRefreshService(
        private val directory: Directory,
        private val searchService: SearchService
) {
    private val logger: Logger = Logger.getLogger(IndexRefreshService::class.simpleName)

    /**
     * to be able to search for a value an index must have been created. On a first load
     * it should not search for a presence of a document in and index because
     * it would fail hard
     */
    private var indexInitialized = false

    /**
     * Method to refresh an index periodically
     */
    @Scheduled(fixedRateString = "PT1H")
    fun refresh() {
        logger.info("Refreshing fulltext index")

        val analyzer = StandardAnalyzer()
        val indexWriterConfig = IndexWriterConfig(analyzer)
        indexWriterConfig.setOpenMode(IndexWriterConfig.OpenMode.CREATE_OR_APPEND);
        val writer = IndexWriter(directory, indexWriterConfig)

        writer.use {
            transaction {
                Contracts.selectAll()
                        .filter {
                            if (indexInitialized) searchService.countById(it[Contracts.id]) == 0
                            else true
                        }
                        .map {
                            val document = Document()
                            document.add(IntPoint(CONTRACT_ID, it[Contracts.id]))
                            document.add(TextField(CONTRACT_TITLE, it[Contracts.title], Field.Store.YES))
                            document.add(TextField(CONTRACT_COUNTERPARTY, it[Contracts.counterparty], Field.Store.YES))

                            // stored fields for data that are not searched, but stored to display in search results
                            document.add(StoredField(CONTRACT_ID, it[Contracts.id]))
                            document.add(StoredField(CONTRACT_DATE, it[Contracts.date]!!.format(DateTimeFormatter.ISO_DATE)))
                            document.add(StoredField(CONTRACT_PROFILE, it[Contracts.profileId]))
                            document.add(StoredField(CONTRACT_COUNTERPARTY, it[Contracts.counterparty]))
                            it[Contracts.currency]?.let { currency -> document.add(StoredField(CONTRACT_CURRENCY, currency)) }
                            it[Contracts.url]?.let { url -> document.add(StoredField(CONTRACT_URL, url)) }
                            it[Contracts.amount]?.let { amount -> document.add(StoredField(CONTRACT_AMOUNT, amount.toLong())) }

                            document
                        }
                        .forEach {
                            writer.addDocument(it)
                            indexInitialized = true
                        }
            }

            val sequenceNumber = writer.commit()
            logger.info("Commited index with last sequence number: $sequenceNumber")

            val sum = writer.directory.listAll()
                    .map { writer.directory.fileLength(it) }
                    .sum()
            logger.info("Index files size: $sum bytes")
        }

        searchService.refresh()
    }
}
