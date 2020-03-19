package digital.cesko

import org.slf4j.LoggerFactory
import org.springframework.boot.test.util.TestPropertyValues
import org.springframework.context.ApplicationContextInitializer
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.test.context.ContextConfiguration
import org.testcontainers.containers.BindMode
import org.testcontainers.containers.PostgreSQLContainer


@ContextConfiguration(initializers = [AbstractSpringDatabaseTest.Initializer::class])
abstract class AbstractSpringDatabaseTest: AbstractSpringTest() {
    companion object {
        private val logger = LoggerFactory.getLogger(this::class.java)

        private val postgres: KPostgreSQLContainer
        private val user: String
        private val pass: String
        private val url: String

        init {
            postgres = KPostgreSQLContainer()
                    .withLogConsumer { frame -> logger.debug(frame.utf8String) }
                    .withClasspathResourceMapping("demo_dump.sql", "/docker-entrypoint-initdb.d/demo_dump.sql", BindMode.READ_ONLY)

            // If 'doNotStartPostgres' is set Postgres on localhost:5432 will be used, otherwise it is started
            // Postgres container can be started by
            // docker run -v $(pwd)/database/demo_dump.sql:/docker-entrypoint-initdb.d/demo_dump.sql \
            // -p 5432:5432 '
            // -e POSTGRES_DB=cityvizor -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=pass postgres:11.1`

            if (System.getProperty("doNotStartPostgres") != null) {
                url = "jdbc:postgresql://localhost:5432/cityvizor"
                user = "postgres"
                pass = "pass"
            } else {
                postgres.start()
                url = postgres.jdbcUrl
                user = postgres.username
                pass = postgres.password
            }

        }

    }

    internal object Initializer : ApplicationContextInitializer<ConfigurableApplicationContext> {
        override fun initialize(configurableApplicationContext: ConfigurableApplicationContext) {
            TestPropertyValues.of(
                    "jdbc.url=" + url,
                    "db.user=" + user,
                    "db.pass=" + pass
            ).applyTo(configurableApplicationContext.environment)
        }
    }
}

class KPostgreSQLContainer : PostgreSQLContainer<KPostgreSQLContainer>("postgres:11.1")
