package digital.cesko.city_sync.model

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer
import digital.cesko.common.*
import org.jetbrains.exposed.sql.ResultRow
import java.math.BigDecimal
import java.time.LocalDate

data class CityExport(
    val id: Int,
    val status: String,
    val url: String?,
    val name: String?,
    val email: String?,
    val ico: String?,
    val dataBox: String?,
    @get:JsonProperty("eDesky") val eDesky: Short?,
    val mapaSamospravy: Short?,
    val gpsX: BigDecimal?,
    val gpsY: BigDecimal?,
    val main: Boolean = false,
    val avatarType: String?,
    val tokenCode: Int,
    val accounting: List<Accounting>?,
    val contracts: List<Contract>?,
    val years: List<Year>?,
    val events: List<Event>?,
    val noticeboards: List<Noticeboard>?,
    val payments: List<Payment>?
) {

    data class Accounting(
        val year: Int?,
        val type: String?,
        val paragraph: Int?,
        val item: Int?,
        val unit: Int?,
        val event: Int?,
        val amount: BigDecimal?
    )

    data class Contract(
        val id: Int,
        @JsonDeserialize(using = LocalDateDeserializer::class)
        val date: LocalDate?,
        val title: String?,
        val counterparty: String?,
        val amount: BigDecimal?,
        val currency: String?,
        val url: String?
    )

    data class Year(
        val year: Int,
        val hidden: Boolean = true,
        @JsonDeserialize(using = LocalDateDeserializer::class)
        val validity: LocalDate?
    )

    data class Event(
        val id: Int,
        val year: Int,
        val name: String,
        val description: String?,
        val eventDescription: EventDescription?
    ) {
        data class EventDescription(
            val year: Int,
            val description: String?,
            val category: String?,
            val eventName: String?,
            val organizationName: String?
        )
    }

    data class Noticeboard(
        @JsonDeserialize(using = LocalDateDeserializer::class)
        val date: LocalDate?,
        val title: String?,
        val category: String?,
        val documentUrl: String?,
        val edeskyUrl: String?,
        val previewUrl: String?,
        val attachments: Int = 0
    )

    data class Payment(
        val year: Int?,
        val paragraph: Int?,
        val item: Int?,
        val unit: Int?,
        val event: Long?,
        val amount: BigDecimal?,
        @JsonDeserialize(using = LocalDateDeserializer::class)
        val date: LocalDate?,
        val counterpartyId: String?,
        val counterpartyName: String?,
        val description: String?
    )
}

fun toProfileCityExport(profile: ResultRow): CityExport = CityExport(
    profile[Profiles.id], profile[Profiles.status], profile[Profiles.url], profile[Profiles.name], profile[Profiles.email],
    profile[Profiles.ico], profile[Profiles.dataBox], profile[Profiles.eDesky], profile[Profiles.mapaSamospravy],
    profile[Profiles.gpsX], profile[Profiles.gpsY], profile[Profiles.main], profile[Profiles.avatarType],
    profile[Profiles.tokenCode], null, null, null, null, null, null
)

fun toAccounting(accounting: ResultRow): CityExport.Accounting = CityExport.Accounting(
    accounting[Accounting.year], accounting[Accounting.type], accounting[Accounting.paragraph],
    accounting[Accounting.item], accounting[Accounting.unit], accounting[Accounting.event], accounting[Accounting.amount]
)

fun toContracts(contract: ResultRow): CityExport.Contract = CityExport.Contract(
    contract[Contracts.id], contract[Contracts.date], contract[Contracts.title],
    contract[Contracts.counterparty], contract[Contracts.amount], contract[Contracts.currency], contract[Contracts.url]
)

fun toYear(year: ResultRow): CityExport.Year = CityExport.Year(
    year[Years.year], year[Years.hidden], year[Years.validity]
)

fun toNoticeboard(noticeboard: ResultRow): CityExport.Noticeboard = CityExport.Noticeboard(
    noticeboard[Noticeboards.date], noticeboard[Noticeboards.title], noticeboard[Noticeboards.category],
    noticeboard[Noticeboards.documentUrl], noticeboard[Noticeboards.edeskyUrl], noticeboard[Noticeboards.previewUrl],
    noticeboard[Noticeboards.attachments]
)

fun toPayment(payment: ResultRow): CityExport.Payment = CityExport.Payment(
    payment[Payments.year], payment[Payments.paragraph], payment[Payments.item], payment[Payments.unit],
    payment[Payments.event], payment[Payments.amount], payment[Payments.date],
    payment[Payments.counterpartyId], payment[Payments.counterpartyName], payment[Payments.description]
)

fun toEvent(event: ResultRow): CityExport.Event = CityExport.Event(
    event[Events.id],
    event[Events.year],
    event[Events.name],
    event[Events.description],
    when (event.getOrNull(EventDescriptions.eventId) != null) {
        true -> toEventDescription(event)
        false -> null
    }
)

fun toEventDescription(eventDesc: ResultRow): CityExport.Event.EventDescription = CityExport.Event.EventDescription(
        eventDesc[EventDescriptions.year], eventDesc[EventDescriptions.description], eventDesc[EventDescriptions.category],
        eventDesc[EventDescriptions.eventName],
        eventDesc[EventDescriptions.organizationName]
)
