package digital.cesko.city_sync

import city_sync.CitySynchronizationService
import city_sync.model.SyncTask
import city_sync.exception.CitySyncException
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.*
import main.kodein
import org.kodein.di.generic.instance

fun Routing.citySynchronizationRouter(): Route {
    val citySyncService by kodein.instance<CitySynchronizationService>()

    return route("/api/v1/citysync") {
        get("/cities") {
            call.respond(citySyncService.getAvailableCities())
        }

        get("/cities/{cityId}") {
            val cityId =
                call.parameters["cityId"] ?: throw CitySyncException(HttpStatusCode.BadRequest, "cityId param is null")
            val city = citySyncService.exportCity(cityId.toInt())

            call.respond(city)
        }
        post("/synchronization") {
            val body = call.receive<SyncTask>()
            val result =
                citySyncService.syncCityDetails(body)

            call.respond(result)
        }
    }
}