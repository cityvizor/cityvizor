package main

import digital.cesko.city_request.CityRequestController
import digital.cesko.city_sync.CitySynchronizationController
import digital.cesko.common.CommonConfig
import digital.cesko.routers.CitySearchController
import org.jetbrains.exposed.sql.Database
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.event.ApplicationStartedEvent
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.context.ApplicationListener
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate


@EnableConfigurationProperties(CommonConfig::class)
// has to enumerate this since we do not follow standard package structure
@SpringBootApplication(
    scanBasePackageClasses = [
        CitySynchronizationController::class,
        CitySearchController::class,
        CityRequestController::class,
        ExposedInitializer::class
    ]
)
class Application {
    @Bean
    fun restTemplate() = RestTemplate()

}

@Component
class ExposedInitializer(
    @Value("\${jdbc.url}") val jdbcUrl: String,
    @Value("\${driver}") val driver: String,
    @Value("\${db.user}") val user: String,
    @Value("\${db.pass}") val password: String
) : ApplicationListener<ApplicationStartedEvent> {
    override fun onApplicationEvent(event: ApplicationStartedEvent) {
        Database.connect(
            url = jdbcUrl,
            driver = driver,
            user = user,
            password = password
        )
    }
}

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}
