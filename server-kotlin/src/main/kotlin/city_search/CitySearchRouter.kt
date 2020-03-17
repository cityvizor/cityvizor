package digital.cesko.routers


import digital.cesko.city_search.CitySearchIndex
import digital.cesko.city_search.CitySearchService
import io.ktor.application.call
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.Routing
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.routing.route

fun Routing.citySearchRouter(): Route {
    return route("/api/v2/service/citysearch") {
        get("/") {
            val response = CitySearchService.search(CitySearchIndex.Search(call.parameters["query"] ?: ""))
            call.respond(response)
        }

        post("/update") {
            CitySearchService.update()
            call.respond("updated")
        }
    }
}
