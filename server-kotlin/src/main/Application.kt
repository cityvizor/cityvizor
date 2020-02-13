package main

import akka.actor.ActorSystem
import com.fasterxml.jackson.databind.SerializationFeature
import com.typesafe.config.Config
import com.typesafe.config.ConfigFactory
import digital.cesko.city_request.cityRequestRouter
import digital.cesko.city_request.google_sheets.GoogleSheets
import digital.cesko.city_search.CitySearchService
import digital.cesko.routers.chartGeneratorRouter
import digital.cesko.routers.citySearchRouter
import io.ktor.application.Application
import io.ktor.application.install
import io.ktor.auth.Authentication
import io.ktor.features.ContentNegotiation
import io.ktor.features.XForwardedHeaderSupport
import io.ktor.jackson.jackson
import io.ktor.routing.routing

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

    routing {
        chartGeneratorRouter()
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
}

