package digital.cesko.city_search

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController()
class CitySearchController {
    @GetMapping("/api/v2/service/citysearch")
    fun search(@RequestParam("query") query: String?) = CitySearchService.search(CitySearchIndex.Search(query ?: ""))

    @GetMapping("/api/v2/service/citysearch/knownCities")
    fun get() = CitySearchService.getKnownCities()

    @PostMapping("/api/v2/service/citysearch/update")
    fun update(): String {
        CitySearchService.update()
        return "updated"
    }
}
