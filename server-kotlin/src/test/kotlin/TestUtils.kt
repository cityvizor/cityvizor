package digital.cesko

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.server.testing.TestApplicationCall
import io.ktor.server.testing.TestApplicationEngine
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody


private val mapper by lazy { jacksonObjectMapper() }

fun TestApplicationEngine.sendRequest(
        method: HttpMethod,
        uri: String,
        body: Any? = null
): TestApplicationCall {
    return handleRequest(method, uri) {
        addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
        setBody(mapper.writeValueAsBytes(body))
    }
}
