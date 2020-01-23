package main

import akka.actor.ActorSystem
import com.fasterxml.jackson.databind.SerializationFeature
import com.typesafe.config.ConfigFactory
import digital.cesko.city_request.CityRequestActors
import digital.cesko.city_request.cityRequestRouter
import digital.cesko.city_search.CitySearchService
import digital.cesko.routers.citySearchRouter
import io.ktor.application.Application
import io.ktor.application.install
import io.ktor.auth.Authentication
import io.ktor.features.ContentNegotiation
import io.ktor.jackson.jackson
import io.ktor.routing.routing

object ApplicationData {
    private lateinit var system: ActorSystem

    fun init() {
        // Create ActorSystem
        system = ActorSystem.create("cdbackend", ConfigFactory.load("application.conf").resolve())

        CitySearchService.create(system)
        CityRequestActors.create(system)
    }
}

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {
    ApplicationData.init()

    install(Authentication) {
    }

    install(ContentNegotiation) {
        jackson {
            enable(SerializationFeature.INDENT_OUTPUT)
        }
    }

    routing {
        citySearchRouter()
        cityRequestRouter()
    }
}

