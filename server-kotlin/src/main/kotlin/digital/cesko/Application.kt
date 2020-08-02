package digital.cesko

import digital.cesko.common.CommonConfig
import org.apache.lucene.store.Directory
import org.apache.lucene.store.MMapDirectory
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.event.ApplicationStartedEvent
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.ApplicationListener
import org.springframework.context.annotation.Bean
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate
import org.springframework.web.filter.ShallowEtagHeaderFilter
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import java.nio.file.Files


@EnableConfigurationProperties(CommonConfig::class)
@SpringBootApplication
@EnableScheduling
class Application {
    @Bean
    fun restTemplate() = RestTemplate()

    @Bean
    fun shallowEtagHeaderFilter(): FilterRegistrationBean<ShallowEtagHeaderFilter?>? {
        val filterRegistrationBean: FilterRegistrationBean<ShallowEtagHeaderFilter?> = FilterRegistrationBean(ShallowEtagHeaderFilter())
        filterRegistrationBean.addUrlPatterns("/api/*")
        filterRegistrationBean.setName("etagFilter")
        return filterRegistrationBean
    }

    @Bean(name = ["fulltextIndex"])
    fun fullTextDirectory(): Directory {
        val tempDirectory = Files.createTempDirectory("search-index")
        logger.info("Search index stored in " + tempDirectory.toAbsolutePath().toString())
        return MMapDirectory(tempDirectory)
    }

    @Bean
    fun corsConfigurer(): WebMvcConfigurer {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry.addMapping("/**").allowedOrigins("*")
            }
        }
    }

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(this::class.java)
    }
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
