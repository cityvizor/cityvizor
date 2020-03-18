package main

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@Deprecated("Use /actuator/info instead")
class HealthController {
    @GetMapping("/api/v2/health")
    fun healthCheck(): String {
        return "ok"
    }
}
