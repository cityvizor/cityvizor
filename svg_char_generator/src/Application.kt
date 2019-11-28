package cz.cityvizor.svg_char_generator

import com.github.nwillc.ksvg.elements.SVG
import cz.cityvizor.svg_char_generator.charts.budgetChart
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

            val budget = client.get<List<Budget>>("https://cityvizor.cz/api/profiles/596f24a4124a1f2016550563/budgets?limit=1").first()

            val svg = SVG.svg {
                attributes["xmlns"] = "http://www.w3.org/2000/svg"
                width = "100%"
                height = "100%"
                viewBox = "0 0 100 150"
               budgetChart(budget.budgetIncomeAmount, budget.incomeAmount)
            }
            val contentType = ContentType.defaultForFileExtension("svg")
            call.respondBytes(svg.toString().toByteArray(), contentType)
        }
    }
}

