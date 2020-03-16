package digital.cesko.city_sync.exception

import io.ktor.http.HttpStatusCode

class CitySyncException(val status: HttpStatusCode? = null, message: String) : Exception(message)