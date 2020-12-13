package digital.cesko.internet_stream

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("internet.stream.service.configuration")
data class InternetStreamServiceConfiguration(
    val urls: Map<String, String>,
    val fileUrls: List<String>,
    val threshold: List<String>
)
