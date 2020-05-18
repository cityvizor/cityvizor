package digital.cesko.city_search

import com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import digital.cesko.common.AccentInsensitiveAnalyzer
import org.apache.lucene.document.Document
import org.apache.lucene.document.Field
import org.apache.lucene.document.TextField
import org.apache.lucene.index.DirectoryReader
import org.apache.lucene.index.IndexWriter
import org.apache.lucene.index.IndexWriterConfig
import org.apache.lucene.queryparser.classic.QueryParser
import org.apache.lucene.search.IndexSearcher
import org.apache.lucene.store.MMapDirectory
import java.nio.file.Files

class CitySearchIndex {
    private val objectMapper = jacksonObjectMapper()
            .configure(FAIL_ON_UNKNOWN_PROPERTIES, false)

    private var directory: MMapDirectory? = null
    lateinit var allCities: List<City>

    val analyzer = AccentInsensitiveAnalyzer()
    val queryParser = QueryParser("content", analyzer)

    fun search(query: String): List<City> {
        if (query == "") {
            return allCities
        } else {
            DirectoryReader.open(directory).use { ireader ->
                val isearcher = IndexSearcher(ireader)

                val split = query.split(" ").filter { it.isNotEmpty() }
                var hits = isearcher.search(queryParser.parse("${split.joinToString(" AND ")}*"), 1000)

                if (hits.totalHits.value == 0L) {
                    hits = isearcher.search(queryParser.parse(split.map { "${it}~" }.joinToString(" AND ")), 1000)
                }

                return hits.scoreDocs.map {
                    allCities[isearcher.doc(it.doc)["_id"].toInt()]
                }
            }
        }
    }

    @Synchronized
    fun createCache() {
        // Read sky to geo mapper
        // once this file is loaded from s3 (where it's auto updated) we can keep local copy
        // in resources as a fallback for offline development
        val dataJson = this::class.java.classLoader.getResource("obce.json")!!.readText()

        allCities = objectMapper.readValue<CitiesWrapper>(dataJson).municipalities

        val newDirectory = MMapDirectory(Files.createTempDirectory("city-search-index"))
        //create index
        val iwc = IndexWriterConfig(analyzer)
        IndexWriter(newDirectory, iwc).use { writer ->
            allCities.forEachIndexed { index, city ->
                val document = Document()
                document.add(TextField("_id", index.toString(), Field.Store.YES))
                document.add(TextField("content", "${city.nazev} ${city.ico}", Field.Store.NO))
                writer.addDocument(document)
            }
        }

        val oldDirectory = directory
        directory = newDirectory
        if (oldDirectory != null) {
            oldDirectory.close()
            Files.walk(oldDirectory.directory)
                    .sorted(Comparator.reverseOrder())
                    .forEach { it.toFile().delete() };
        }
    }

    data class Search(
            val query: String
    )
}
