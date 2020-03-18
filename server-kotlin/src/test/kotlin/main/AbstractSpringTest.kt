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
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.servlet.MockMvc
import org.testcontainers.containers.BindMode
import org.testcontainers.containers.PostgreSQLContainer


@ExtendWith(SpringExtension::class)
@SpringBootTest(classes = [Application::class])
@AutoConfigureMockMvc
@ContextConfiguration(initializers = [AbstractSpringTest.Initializer::class])
abstract class AbstractSpringTest {
    @Autowired
    protected lateinit var mockMvc: MockMvc

    @Autowired
    protected lateinit var objectMapper: ObjectMapper

    protected fun Any.asJson() = objectMapper.writeValueAsString(this)

    companion object {
        private val logger = LoggerFactory.getLogger(this::class.java)

        val postgres: KPostgreSQLContainer = KPostgreSQLContainer()
                .withLogConsumer { frame -> logger.debug(frame.utf8String) }
                .withClasspathResourceMapping("demo_dump.sql", "/docker-entrypoint-initdb.d/demo_dump.sql", BindMode.READ_ONLY)
                .apply {
                    start()
                }

    }

    internal object Initializer : ApplicationContextInitializer<ConfigurableApplicationContext> {
        override fun initialize(configurableApplicationContext: ConfigurableApplicationContext) {
            TestPropertyValues.of(
                    "jdbc.url=" + postgres.jdbcUrl,
                    "db.user=" + postgres.username,
                    "db.pass=" + postgres.password
            ).applyTo(configurableApplicationContext.environment)
        }
    }
}

class KPostgreSQLContainer : PostgreSQLContainer<KPostgreSQLContainer>("postgres:11.1")
