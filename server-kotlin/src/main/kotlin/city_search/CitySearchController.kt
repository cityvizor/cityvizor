package digital.cesko.routers


import digital.cesko.city_search.CitySearchIndex
import digital.cesko.city_search.CitySearchService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import javax.websocket.server.PathParam

@RestController()
class CitySearchController {
    @GetMapping("/api/v2/service/citysearch")
    fun search(@PathParam("query") query: String?) = CitySearchService.search(CitySearchIndex.Search(query ?: ""))

    @PostMapping("/api/v2/service/citysearch/update")
    fun update(): String {
        CitySearchService.update()
        return "updated"
    }
}
