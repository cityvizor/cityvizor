package digital.cesko.city_request

import io.ktor.application.call
import io.ktor.features.origin
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.Routing
import io.ktor.routing.post
import io.ktor.routing.route
import java.time.LocalDateTime
import java.time.ZoneId

fun Routing.cityRequestRouter(
    timeZone: String,
    cityRequestStore: CityRequestStore
): Route {
    return route("/api/v2/service/cityrequest") {
        post("/") {
            try {
                val request = call.receive(CityRequest::class)
                    .updateServerData(
                        call.request.origin.remoteHost,
                        LocalDateTime.now(ZoneId.of(timeZone))
                    )

                cityRequestStore.insert(request)
                call.respond(HttpStatusCode.OK, "ok")
            } catch (e: Exception) {
                call.respond(HttpStatusCode.OK, "error")
            }
        }
    }
}

