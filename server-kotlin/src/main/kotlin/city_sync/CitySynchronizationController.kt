package digital.cesko.city_sync

import digital.cesko.city_sync.model.SyncTask
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/citysync")
class CitySynchronizationController(private val citySyncService: CitySynchronizationService) {
    @GetMapping("/cities")
    fun getCities() = citySyncService.getAvailableCities()

    @GetMapping("/cities/{cityId}")
    fun getCity(@PathVariable cityId: Int) = citySyncService.exportCity(cityId)

    @PostMapping("/synchronization")
    @ResponseStatus(HttpStatus.CREATED)
    fun synchronize(syncTask: SyncTask) {
        citySyncService.syncCityDetails(syncTask)
    }
}
