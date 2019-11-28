package cz.cityvizor

import io.ktor.application.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.http.*
import com.fasterxml.jackson.databind.*
import com.fasterxml.jackson.datatype.joda.JodaModule
import cz.cityvizor.model.ErrorModel
import cz.cityvizor.model.FTSException
import cz.cityvizor.model.Invoices
import cz.cityvizor.router.searchRouter
import cz.cityvizor.service.import
import io.ktor.jackson.*
import io.ktor.features.*
import io.ktor.client.*
import io.ktor.client.engine.jetty.*
import io.ktor.util.KtorExperimentalAPI
import org.apache.lucene.store.RAMDirectory
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

val memoryIndex = RAMDirectory()

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@KtorExperimentalAPI
@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {
    install(ContentNegotiation) {
        jackson {
            enable(SerializationFeature.INDENT_OUTPUT)
            registerModule(JodaModule())
            disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
        }
    }
    val jdbcUrl = environment.config.property("ktor.cityvizor.jdbcUrl").getString()
    val dbUser = environment.config.property("ktor.cityvizor.dbUser").getString()
    val dbPass = environment.config.property("ktor.cityvizor.dbPass").getString()
    Database.connect(jdbcUrl, driver = "org.postgresql.Driver",
        user = dbUser, password = dbPass)
    transaction {
        SchemaUtils.drop(Invoices)
    }

    val client = HttpClient(Jetty) {
    }
    install(StatusPages) {
        exception<FTSException> { cause ->
            call.respond(HttpStatusCode.BadRequest, ErrorModel(cause.message))
        }
    }

    routing {
        searchRouter()
    }

    import()
}

