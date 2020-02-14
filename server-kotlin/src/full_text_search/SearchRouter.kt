package full_text_search

import full_text_search.model.FTSException
import full_text_search.service.combineLucineAndDBData
import full_text_search.service.search
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.response.respond
import io.ktor.routing.Routing
import io.ktor.routing.get
import org.apache.lucene.store.RAMDirectory

val memoryIndex = RAMDirectory()
fun Routing.fullTextSearchRouter() {
    get("/search") {
        val query = call.request.queryParameters["query"] ?: throw FTSException("No query supplied")
        val profile = call.request.queryParameters["profile"]
        val lucine = search(query, profile)
        call.respond(HttpStatusCode.OK, combineLucineAndDBData(lucine))
    }
}