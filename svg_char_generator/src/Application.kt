package cz.cityvizor.svg_char_generator

import com.github.nwillc.ksvg.elements.SVG
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
import kotlinx.html.dom.append
import kotlinx.html.dom.create
import kotlinx.html.dom.document
import kotlinx.html.stream.appendHTML
import java.io.File
import kotlinx.html.*
import kotlinx.html.dom.*
import java.io.FileWriter


fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {

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
                g {
                    rect {
                        x = "25"
                        width = "50"
                        y = "10"
                        height = "10"
                        fill = "#ff9491"
                    }
                    rect {
                        x = "25"
                        width = "50"
                        y = "10"
                        height = "10"
                        fill = "#E73431"
                    }
                }
            }
            val contentType = ContentType.defaultForFileExtension("svg")
            call.respondBytes(svg.toString().toByteArray(), contentType)
        }
    }
}

