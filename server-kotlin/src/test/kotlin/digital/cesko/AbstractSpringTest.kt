package digital.cesko

import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActionsDsl
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post

@ExtendWith(SpringExtension::class)
@SpringBootTest(classes = [Application::class])
@AutoConfigureMockMvc
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
}
