package city_search

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

@JsonIgnoreProperties(ignoreUnknown = true)
data class City(
    @JsonProperty("adresaUradu")
    val adresaUradu: AdresaUradu?,
    @JsonProperty("datovaSchranka")
    val datovaSchranka: String?,
    @JsonProperty("eDeskyId")
    val eDeskyId: String?,
    @JsonProperty("emails")
    val emails: List<Email?>?,
    @JsonProperty("ICO")
    val iCO: String?,
    @JsonProperty("nazev")
    val nazev: String?,
    @JsonProperty("souradniceJTSK")
    val souradniceJTSK: SouradniceJTSK?,
    @JsonProperty("souradniceWGS")
    val souradniceWGS: SouradniceWGS?,
    @JsonProperty("zkratka")
    val zkratka: String?,
    val urlCityVizor: String?,
    val urlZnak: String?,
    val pocetObyvatel: Int = 0
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    data class AdresaUradu(
        @JsonProperty("adresniBod")
        val adresniBod: String?,
        @JsonProperty("castObceNeboKatastralniUzemi")
        val castObceNeboKatastralniUzemi: String?,
        @JsonProperty("cisloDomovni")
        val cisloDomovni: String?,
        @JsonProperty("krajNazev")
        val krajNazev: String?,
        @JsonProperty("obecKod")
        val obecKod: String?,
        @JsonProperty("obecNazev")
        val obecNazev: String?,
        @JsonProperty("pSC")
        val pSC: String?,
        @JsonProperty("uliceNazev")
        val uliceNazev: String?
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class Email(
        @JsonProperty("email")
        val email: String?,
        @JsonProperty("typ")
        val typ: String?
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class SouradniceJTSK(
        @JsonProperty("souradniceX")
        val souradniceX: String?,
        @JsonProperty("souradniceY")
        val souradniceY: String?
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class SouradniceWGS(
        @JsonProperty("lat")
        val lat: Double?,
        @JsonProperty("lon")
        val lon: Double?,
        @JsonProperty("vyska")
        val vyska: Double?,
        @JsonProperty("wgs84_latitude")
        val wgs84Latitude: String?,
        @JsonProperty("wgs84_longitude")
        val wgs84Longitude: String?
    )
}