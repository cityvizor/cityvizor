package digital.cesko.common

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("city-sync")
data class CommonConfig(
    val instanceUrls: Map<String, String>
)
