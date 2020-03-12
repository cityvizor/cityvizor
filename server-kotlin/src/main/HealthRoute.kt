package main

import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.Routing
import io.ktor.routing.get
import io.ktor.routing.route


fun Routing.healthCheck(): Route {
    return route("/api/v2/health") {
        get("/") {
            call.respond(HttpStatusCode.OK, "ok")
        }
    }
}
