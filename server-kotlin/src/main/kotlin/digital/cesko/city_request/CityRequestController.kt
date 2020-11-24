package digital.cesko.city_request

import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime
import java.time.ZoneId
import javax.servlet.http.HttpServletRequest

@RestController
class CityRequestController(
    private val cityRequestStore: CityRequestStore,
    @Value("\${city-request.timeZone}") private val timeZone: ZoneId
) {
    @PostMapping("/api/v2/service/cityrequest")
    fun requestCity(@RequestBody cityRequest: CityRequest, request: HttpServletRequest): String {
        cityRequestStore.insert(
            cityRequest.updateServerData(
                ip = request.remoteAddr,
                time = LocalDateTime.now(timeZone)
            )
        )
        return "ok"
    }
}
