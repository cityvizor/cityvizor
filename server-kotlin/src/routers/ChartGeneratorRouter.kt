package digital.cesko.routers

import chart_generator.charts.getBudgetChart
import chart_generator.pojo.Budget
import io.ktor.application.call
import io.ktor.client.HttpClient
import io.ktor.http.ContentType
import io.ktor.http.defaultForFileExtension
import io.ktor.response.respondBytes
import io.ktor.response.respondText
import io.ktor.routing.*
import io.ktor.client.features.json.GsonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.request.get

fun Routing.chartGeneratorRouter(): Route {
    val client = HttpClient {
        install(JsonFeature) {
            serializer = GsonSerializer()
        }
    }

    return route("/api/v2/service/chartgenerator") {
        get("/") {
            call.respondText("HELLO WORLD!", contentType = ContentType.Text.Plain)
        }

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