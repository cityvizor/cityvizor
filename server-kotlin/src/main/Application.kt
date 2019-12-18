package main

import akka.actor.ActorSystem
import io.ktor.application.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.http.*
import io.ktor.auth.*
import com.fasterxml.jackson.databind.*
import com.typesafe.config.ConfigFactory
import digital.cesko.city_search.CitySearchService
import digital.cesko.routers.citySearchRouter
import io.ktor.jackson.*
import io.ktor.features.*

object ApplicationData {
    lateinit var system: ActorSystem
        private set

    fun init() {
        /*
            Create ActorSystem
         */
        system = ActorSystem.create("cdbackend", ConfigFactory.load("application.conf").resolve())

        CitySearchService.create(system)
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
    }
}

