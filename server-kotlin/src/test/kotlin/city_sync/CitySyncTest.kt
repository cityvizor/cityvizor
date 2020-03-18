package city_sync

import main.AbstractSpringTest
import net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson
import org.assertj.core.api.Assertions.assertThat
import org.springframework.test.web.servlet.get
import kotlin.test.Test

class CitySyncTest : AbstractSpringTest() {
    @Test
    fun `Should list cities`() {
        val result = mockMvc.get("/api/v1/citysync/cities").andReturn()
        assertThat(result.response.status).isEqualTo(200)
        assertThatJson(result.response.contentAsString).isArray().contains("""{"id" : 6, "name" : "Praha 3", "ico" : "00063517"}""")
    }
}
