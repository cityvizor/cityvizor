package main

import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.extension.ExtendWith
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.util.TestPropertyValues
import org.springframework.context.ApplicationContextInitializer
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActionsDsl
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.testcontainers.containers.BindMode
import org.testcontainers.containers.PostgreSQLContainer


@ExtendWith(SpringExtension::class)
@SpringBootTest(classes = [Application::class])
@AutoConfigureMockMvc
@ContextConfiguration(initializers = [AbstractSpringTest.Initializer::class])
@ActiveProfiles("test")
abstract class AbstractSpringTest {
    @Autowired
    protected lateinit var mockMvc: MockMvc

    @Autowired
    protected lateinit var objectMapper: ObjectMapper

    protected fun post(uri: String, payload: Any): ResultActionsDsl {
        return mockMvc.post(uri) {
            content = payload.asJson()
            contentType = MediaType.APPLICATION_JSON
        }
    }

    protected fun get(uri: String): ResultActionsDsl = mockMvc.get(uri)

    protected fun Any.asJson() = objectMapper.writeValueAsString(this)

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
