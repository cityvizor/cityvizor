package main

import akka.actor.ActorSystem
import com.fasterxml.jackson.databind.SerializationFeature
import com.typesafe.config.Config
import com.typesafe.config.ConfigFactory
import digital.cesko.city_request.cityRequestRouter
import digital.cesko.city_request.google_sheets.GoogleSheets
import digital.cesko.city_search.CitySearchService
import digital.cesko.routers.citySearchRouter
import full_text_search.fullTextSearchRouter
import full_text_search.model.ErrorModel
import full_text_search.model.FTSException
import full_text_search.model.Invoices
import full_text_search.service.import
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.auth.Authentication
import io.ktor.client.HttpClient
import io.ktor.features.ContentNegotiation
import io.ktor.features.StatusPages
import io.ktor.features.XForwardedHeaderSupport
import io.ktor.http.HttpStatusCode
import io.ktor.jackson.jackson
import io.ktor.response.respond
import io.ktor.routing.routing
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

object ApplicationData {
    private lateinit var system: ActorSystem

    fun init(configuration: Config) {

        // Create ActorSystem
        system = ActorSystem.create("cdbackend", configuration)

        CitySearchService.create(system)
    }
}

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {

    val configuration = ConfigFactory.load("application.conf").resolve()

    ApplicationData.init(configuration)

    install(Authentication) {
    }

    install(ContentNegotiation) {
        jackson {
            enable(SerializationFeature.INDENT_OUTPUT)
        }
    }

    install(XForwardedHeaderSupport)    // city request logs remote IP

    val jdbcUrl = configuration.getString("ktor.cityvizor.jdbcUrl")
    val dbUser = configuration.getString("ktor.cityvizor.dbUser")
    val dbPass = configuration.getString("ktor.cityvizor.dbPass")
    Database.connect(jdbcUrl, driver = "org.postgresql.Driver",
            user = dbUser, password = dbPass)
    transaction {
        SchemaUtils.drop(Invoices)
    }
    install(StatusPages) {
        exception<FTSException> { cause ->
            call.respond(HttpStatusCode.BadRequest, ErrorModel(cause.message))
        }
    }
    routing {
        fullTextSearchRouter()
        citySearchRouter()
        cityRequestRouter(
            configuration.getString("app.city-request.timeZone"),
            GoogleSheets(
                System.getProperty("googleCredentials"),
                configuration.getString("app.city-request.sheetId"),
                configuration.getString("app.city-request.listName"),
                configuration.getString("app.city-request.appName")
            )
        )
    }

    import()
}

