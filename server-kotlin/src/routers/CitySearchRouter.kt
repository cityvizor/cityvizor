package digital.cesko.routers

import akka.actor.ActorRef
import akka.pattern.Patterns
import digital.cesko.city_search.CitySearchIndex
import digital.cesko.city_search.CitySearchService
import io.ktor.application.call
import io.ktor.response.respond
import io.ktor.routing.*
import scala.concurrent.Await
import scala.concurrent.duration.FiniteDuration
import java.util.concurrent.TimeUnit

fun Routing.citySearchRouter(): Route {
    return route("/api/v2/service/citysearch") {
        get("/") {
            val response = Await.result(
                Patterns.ask(
                    CitySearchService.get(),
                    CitySearchIndex.Search(call.parameters["query"] ?: ""),
                    10000
                ), FiniteDuration.create(10, TimeUnit.SECONDS)
            )
            call.respond(response)
        }

        post("/update") {
            CitySearchService.get()?.tell(CitySearchIndex.CreateCache(), ActorRef.noSender())

            call.respond("updated")
        }
    }
}