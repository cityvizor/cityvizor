package digital.cesko

import io.ktor.config.MapApplicationConfig
import io.ktor.server.testing.TestApplicationEngine
import io.ktor.server.testing.withTestApplication
import main.module
import org.junit.ClassRule
import org.slf4j.LoggerFactory
import org.testcontainers.containers.BindMode
import org.testcontainers.containers.PostgreSQLContainer


abstract class AbstractKtorTest {
    fun <R> runTest(test: TestApplicationEngine.() -> R): R {
        return withTestApplication({
            (environment.config as MapApplicationConfig).apply {
                put("ktor.database.jdbcUrl", postgres.jdbcUrl)
                put("ktor.database.driver", postgres.driverClassName)
                put("ktor.database.dbUser", postgres.username)
                put("ktor.database.dbPass", postgres.password)
            }
            module(testing = true)
        }, test)
    }

    companion object {
        private val logger = LoggerFactory.getLogger(this.javaClass)
        @ClassRule
        @JvmField
        val postgres: KPostgreSQLContainer = KPostgreSQLContainer()
                .withLogConsumer { frame -> logger.debug(frame.utf8String) }
                .withClasspathResourceMapping("demo_dump.sql", "/docker-entrypoint-initdb.d/demo_dump.sql", BindMode.READ_ONLY)
    }
}

class KPostgreSQLContainer : PostgreSQLContainer<KPostgreSQLContainer>("postgres:11.1")
