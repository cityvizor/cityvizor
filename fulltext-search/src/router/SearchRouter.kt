package cz.cityvizor.router

import cz.cityvizor.model.FTSException
import cz.cityvizor.service.combineLucineAndDBData
import cz.cityvizor.service.search
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.response.respond
import io.ktor.routing.Routing
import io.ktor.routing.get

fun Routing.searchRouter() {
    get("/search") {
        val query = call.request.queryParameters["query"] ?: throw FTSException("No query supplied")
        val profile = call.request.queryParameters["profile"]
        val lucine = search(query, profile)
        call.respond(HttpStatusCode.OK, combineLucineAndDBData(lucine))
    }
}