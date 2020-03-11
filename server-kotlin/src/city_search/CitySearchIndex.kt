package digital.cesko.city_search

import city_search.City
import com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.apache.lucene.analysis.CharArraySet
import org.apache.lucene.analysis.LowerCaseFilter
import org.apache.lucene.analysis.StopFilter
import org.apache.lucene.analysis.StopwordAnalyzerBase
import org.apache.lucene.analysis.TokenStream
import org.apache.lucene.analysis.Tokenizer
import org.apache.lucene.analysis.miscellaneous.ASCIIFoldingFilter
import org.apache.lucene.analysis.standard.StandardTokenizer
import org.apache.lucene.document.Document
import org.apache.lucene.document.Field
import org.apache.lucene.document.TextField
import org.apache.lucene.index.DirectoryReader
import org.apache.lucene.index.IndexWriter
import org.apache.lucene.index.IndexWriterConfig
import org.apache.lucene.queryparser.classic.QueryParser
import org.apache.lucene.search.IndexSearcher
import org.apache.lucene.store.Directory
import org.apache.lucene.store.RAMDirectory


class AccentInsensitiveAnalyzer : StopwordAnalyzerBase(CharArraySet.EMPTY_SET) {
    override fun createComponents(fieldName: String?): TokenStreamComponents {
        val source: Tokenizer = StandardTokenizer()
        var tokenStream: TokenStream? = source
        tokenStream = LowerCaseFilter(tokenStream)
        tokenStream = StopFilter(tokenStream, stopwordSet)
        tokenStream = ASCIIFoldingFilter(tokenStream)
        return TokenStreamComponents(source, tokenStream)
    }
}

class CitySearchIndex {
    private val objectMapper = jacksonObjectMapper()
            .configure(FAIL_ON_UNKNOWN_PROPERTIES, false)

    private var directory: Directory? = null
    lateinit var resultCities: ArrayList<City>

    val analyzer = AccentInsensitiveAnalyzer()
    val queryParser = QueryParser("content", analyzer)

    fun search(query: String): List<City> {
        if (query == "") {
            return resultCities
        } else {
            val ireader = DirectoryReader.open(directory)
            val isearcher = IndexSearcher(ireader)

            val split = query.split(" ")
            var hits = isearcher.search(queryParser.parse("${split.filter { it.length > 0 }.joinToString(" AND ")}*"), 10000)

            if (hits.totalHits.value == 0L) {
                hits = isearcher.search(queryParser.parse(split.filter { it.length > 0 }.map { "${it}~" }.joinToString(" AND ")), 10000)
            }

            return hits.scoreDocs.map {
                resultCities[isearcher.doc(it.doc)["_id"].toInt()]
            }
        }
    }

    fun createCache() {
        // Read sky to geo mapper
        // once this file is loaded from s3 (where it's auto updated) we can keep local copy
        // in resources as a fallback for offline development
        val dataJson = this::class.java.classLoader.getResource("citylistmetadata_finalresult.json")!!.readText()

        resultCities = objectMapper.readValue(dataJson)

        val newDirectory = RAMDirectory()
        //create index
        val iwc = IndexWriterConfig(analyzer)
        val writer = IndexWriter(newDirectory, iwc)

        resultCities.forEachIndexed { index, city ->
            val document = Document()
            document.add(TextField("_id", index.toString(), Field.Store.YES))
            document.add(TextField("content", "${city.nazev} ${city.ico}", Field.Store.NO))
            writer.addDocument(document)
        }

        writer.close()

        val oldDirectory = directory
        directory = newDirectory
        oldDirectory?.close()
    }

    data class Search(
            val query: String
    )
}
