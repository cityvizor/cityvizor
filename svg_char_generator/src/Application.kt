package cz.cityvizor.svg_char_generator

import com.github.nwillc.ksvg.elements.SVG
import cz.cityvizor.svg_char_generator.charts.Coordinates
import cz.cityvizor.svg_char_generator.charts.budgetChart
import cz.cityvizor.svg_char_generator.charts.getBudgetChart
import cz.cityvizor.svg_char_generator.pojo.Budget
import io.ktor.application.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.http.*
import io.ktor.client.*
import io.ktor.client.features.json.GsonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.request.get
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty

fun main(args: Array<String>) {
    //io.ktor.server.netty.main(args) // Manually using Netty's EngineMain
    embeddedServer(
            Netty, watchPaths = listOf("svg_char_generator"), port = 8080,
            module = Application::module
    ).apply {
        start(wait = true)
    }
}

fun Application.module() {
    val client = HttpClient {
        install(JsonFeature) {
            serializer = GsonSerializer()
        }
    }


    routing {
        get("/") {
            call.respondText("HELLO WORLD!", contentType = ContentType.Text.Plain)
        }

        // /budget - year
        get("/budget") {
            val year = (call.request.queryParameters["year"] ?: "2019").toInt()


            val cityId = "596f24a4124a1f2016550563"
            val numberOfBudgets = 3
            val budgets = client.get<List<Budget>>("https://cityvizor.cz/api/profiles/$cityId/budgets?limit=$numberOfBudgets&sort=-year")
            val budget = budgets.find { it.year == year } ?: budgets.first()

            val svg = getBudgetChart(budget)
            val contentType = ContentType.defaultForFileExtension("svg")
            call.respondBytes(svg.toString().toByteArray(), contentType)
        }
    }
}

