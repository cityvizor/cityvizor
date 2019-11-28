package cz.cityvizor.svg_char_generator

import com.github.nwillc.ksvg.elements.SVG
import cz.cityvizor.svg_char_generator.charts.budgetChart
import io.ktor.application.*
import io.ktor.response.*
import io.ktor.request.*
import io.ktor.routing.*
import io.ktor.http.*
import io.ktor.html.*
import kotlinx.html.*
import kotlinx.html.title
import io.ktor.client.*
import io.ktor.client.engine.apache.*
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import kotlinx.html.dom.append
import kotlinx.html.dom.create
import kotlinx.html.dom.document
import kotlinx.html.stream.appendHTML
import java.io.File
import kotlinx.html.*
import kotlinx.html.dom.*
import java.io.FileWriter
import java.math.BigDecimal

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

    routing {
        get("/") {
            call.respondText("HELLO WORLD!", contentType = ContentType.Text.Plain)
        }

        // /budget - year
        get("/budget") {
            val year = (call.request.queryParameters["year"] ?: "2019").toInt()



            val svg = SVG.svg() {
                attributes["xmlns"] = "http://www.w3.org/2000/svg"
                width = "100%"
                height = "100%"
                viewBox = "0 0 100 150"
               budgetChart(100.0, 55.0)
            }
            val contentType = ContentType.defaultForFileExtension("svg")
            call.respondBytes(svg.toString().toByteArray(), contentType)
        }
    }
}

