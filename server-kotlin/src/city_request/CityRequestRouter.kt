package digital.cesko.city_request

import akka.pattern.Patterns
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.Routing
import io.ktor.routing.post
import io.ktor.routing.route

fun Routing.cityRequestRouter(): Route {
    return route("/api/v2/service/cityrequest") {
        post("/") {
            Patterns.ask(
                CityRequestActors.get(),
                call.receive(CityRequest::class),
                10_000
            )

            call.respond(HttpStatusCode.OK, "sent")
        }
    }
}

