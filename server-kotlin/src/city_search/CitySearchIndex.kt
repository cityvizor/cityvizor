package digital.cesko.city_search

import akka.actor.ActorRef
import akka.actor.UntypedAbstractActor
import city_search.City
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.apache.lucene.analysis.*
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


class AccentInsensitiveAnalyzer(): StopwordAnalyzerBase(CharArraySet.EMPTY_SET) {

    override fun createComponents(fieldName: String?): TokenStreamComponents {
        val source: Tokenizer = StandardTokenizer()
        var tokenStream: TokenStream? = source
        tokenStream = LowerCaseFilter(tokenStream)
        tokenStream = StopFilter(tokenStream, stopwordSet)
        tokenStream = ASCIIFoldingFilter(tokenStream)
        return TokenStreamComponents(source, tokenStream)
    }
}

class CitySearchIndex: UntypedAbstractActor() {

    var directory: Directory = RAMDirectory()
    lateinit var resultCities: ArrayList<City>

    val analyzer = AccentInsensitiveAnalyzer()
    val queryParser = QueryParser("content", analyzer)

    override fun onReceive(message: Any?) {
        if (message is CreateCache) {
            createCache()
        } else if (message is Search) {
            if (message.query == "") {
                /*
                    Return top30 cities
                 */
                val topResult = resultCities.sortedByDescending {
                    return@sortedByDescending it.pocetObyvatel
                }.subList(0, 30)

                sender.tell(topResult, ActorRef.noSender())
            } else {
                val ireader = DirectoryReader.open(directory)
                val isearcher = IndexSearcher(ireader)

                val split = message.query.split(" ")
                var hits = isearcher.search(queryParser.parse("${split.filter { it.length > 0 }.joinToString(" AND ")}*"), 10000)

                if (hits.totalHits.value == 0L) {
                    hits = isearcher.search(queryParser.parse(split.filter { it.length > 0 }.map { "${it}~" }.joinToString(" AND ")), 10000)
                }

                val searchResults = hits.scoreDocs.map {
                    resultCities[isearcher.doc(it.doc)["_id"].toInt()]
                }.sortedByDescending {
                    return@sortedByDescending it.pocetObyvatel
                }
                if (searchResults.size > 30) {
                    sender.tell(searchResults.subList(0, 30), ActorRef.noSender())
                } else {
                    sender.tell(searchResults, ActorRef.noSender())
                }
            }
        }
    }

    override fun preStart() {
        self.tell(CreateCache(), ActorRef.noSender())
    }

    fun createCache() {
        /*
            Read sky to geo mapper
         */
        val dataJson = this::class.java.classLoader.getResource("citylistmetadata_finalresult.json")!!.readText()

        resultCities = jacksonObjectMapper().readValue(dataJson)

        directory.close()
        directory = RAMDirectory()

        //create index
        val iwc = IndexWriterConfig(analyzer)
        val writer = IndexWriter(directory, iwc)

        resultCities.forEachIndexed { index, city ->
            val document = Document()
            document.add(TextField("_id", index.toString(), Field.Store.YES))
            document.add(TextField("content", "${city.nazev} ${city.iCO}", Field.Store.NO))
            writer.addDocument(document)
        }

        writer.close()

    }

    class CreateCache

    data class Search(
        val query: String
    )
}