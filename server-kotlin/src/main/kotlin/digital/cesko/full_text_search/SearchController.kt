package digital.cesko.full_text_search

import digital.cesko.full_text_search.model.SearchResult
import digital.cesko.full_text_search.service.SearchService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Nullable

@RestController
class SearchController(
        private val searchService: SearchService
) {

    @GetMapping("/api/v2/search")
    fun search(
            @RequestParam("query") query: String,
            @Nullable @RequestParam("profile") profile: String?
    ): Collection<SearchResult> {
        return searchService.search(query, profile);
    }
}
