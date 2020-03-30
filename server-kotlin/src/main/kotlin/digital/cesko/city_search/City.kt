package digital.cesko.city_search

import com.fasterxml.jackson.annotation.JsonProperty
import java.math.BigDecimal

data class City(
        @get:JsonProperty("adresaUradu")
        val adresaUradu: AdresaUradu?,
        @get:JsonProperty("datovaSchrankaID")
        val datovaSchrankaID: String?,
        @get:JsonProperty("eDeskyID")
        val eDeskyID: String?,
        @get:JsonProperty("mail")
        val mail: List<String>?,
        @get:JsonProperty("ICO")
        val ico: String?,
        @get:JsonProperty("nazev")
        val nazev: String?,
        @get:JsonProperty("hezkyNazev")
        val hezkyNazev: String?,
        @get:JsonProperty("souradnice")
        val souradnice: List<BigDecimal>?,
        @get:JsonProperty("zkratka")
        val zkratka: String?,
        val urlCityVizor: String?,
        val urlZnak: String?,
        val pocetObyvatel: Int = 0
) {
    data class AdresaUradu(
            @get:JsonProperty("adresniBod")
            val adresniBod: String?,
            @get:JsonProperty("castObce")
            val castObce: String?,
            @get:JsonProperty("cisloDomovni")
            val cisloDomovni: String?,
            @get:JsonProperty("cisloOrientacni")
            val cisloOrientacni: String?,
            @get:JsonProperty("kraj")
            val kraj: String?,
            @get:JsonProperty("obecKod")
            val obecKod: String?,
            @get:JsonProperty("obec")
            val obec: String?,
            @get:JsonProperty("PSC")
            val psc: String?,
            @get:JsonProperty("ulice")
            val ulice: String?
    )
}
