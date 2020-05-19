package digital.cesko.city_search


import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController()
class CitySearchController {
    @GetMapping("/api/v2/service/citysearch")
    fun search(@RequestParam("query") query: String?): ResponseEntity<List<City>> {
        val results = CitySearchService.search(CitySearchIndex.Search(query ?: ""))

        val linkHeader = results
                .filter { !it.urlZnak.isNullOrBlank() }
                .map { "<${it.urlZnak}>; rel=\"preload\"; as=\"image\"" }
                .joinToString(",")

        return ResponseEntity.ok()
                .header(HttpHeaders.LINK, linkHeader)
                .body(results);
    }

    @PostMapping("/api/v2/service/citysearch/update")
    fun update(): String {
        CitySearchService.update()
        return "updated"
    }
}
