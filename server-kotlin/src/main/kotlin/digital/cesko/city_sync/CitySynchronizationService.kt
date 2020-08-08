package digital.cesko.city_sync

import digital.cesko.city_sync.exception.CitySyncException
import digital.cesko.city_sync.model.CityBasic
import digital.cesko.city_sync.model.CityExport
import digital.cesko.city_sync.model.SyncResponse
import digital.cesko.city_sync.model.SyncTask
import digital.cesko.city_sync.model.toAccounting
import digital.cesko.city_sync.model.toContracts
import digital.cesko.city_sync.model.toEvent
import digital.cesko.city_sync.model.toNoticeboard
import digital.cesko.city_sync.model.toPayment
import digital.cesko.city_sync.model.toProfileCityExport
import digital.cesko.city_sync.model.toYear
import digital.cesko.common.Accounting
import digital.cesko.common.CommonConfig
import digital.cesko.common.Contracts
import digital.cesko.common.EventDescriptions
import digital.cesko.common.Events
import digital.cesko.common.Noticeboards
import digital.cesko.common.Payments
import digital.cesko.common.Profiles
import digital.cesko.common.Years
import org.jetbrains.exposed.sql.batchInsert
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder

@Service
class CitySynchronizationService(
    val config: CommonConfig,
    val restTemplate: RestTemplate
) {
    fun getAvailableCities(): List<CityBasic> {
        return transaction {
            Profiles
                .slice(Profiles.id, Profiles.name, Profiles.ico)
                .selectAll()
                .map {
                    CityBasic(it[Profiles.id], it[Profiles.name], it[Profiles.ico])
                }
        }
    }

    fun exportCity(cityId: Int): CityExport {
        val city = transaction {
            Profiles
                .select { Profiles.id eq cityId }
                .map { toProfileCityExport(it) }
                .ifEmpty { throw CitySyncException("CityId $cityId not found.") }
                .first()
        }

        return city.copy(
            accounting = transaction {
                Accounting
                    .select { Accounting.profileId eq cityId }
                    .map { toAccounting(it) }
            },
            contracts = transaction {
                Contracts
                    .select { Contracts.profileId eq cityId }
                    .map { toContracts(it) }
            },
            years = transaction {
                Years
                    .select { Years.profileId eq cityId }
                    .map { toYear(it) }
            },
            events = transaction {
                (Events leftJoin EventDescriptions)
                    .select { Events.profileId eq (cityId) }
                    .map { toEvent(it) }
            },
            noticeboards = transaction {
                Noticeboards
                    .select { Noticeboards.profileId eq cityId }
                    .map { toNoticeboard(it) }
            },
            payments = transaction {
                Payments
                    .select { Payments.profileId eq cityId }
                    .map { toPayment(it) }
            }
        )
    }

    fun syncCityDetails(syncTask: SyncTask): SyncResponse {
        try {
            val cityExport = callInstance(syncTask)

            val cityExportInLocalDB = transaction {
                Profiles
                    .select { Profiles.ico eq cityExport.ico }
                    .mapNotNull { toProfileCityExport(it) }
                    .firstOrNull()
            }
            return transaction {
                when (cityExportInLocalDB != null) {
                    true -> {
                        // deletes data if already exists
                        Profiles.deleteWhere { Profiles.id eq cityExportInLocalDB.id }
                        Accounting.deleteWhere { Accounting.profileId eq cityExportInLocalDB.id }
                        Contracts.deleteWhere { Contracts.profileId eq cityExportInLocalDB.id }
                        Years.deleteWhere { Years.profileId eq cityExportInLocalDB.id }
                        Events.deleteWhere { Events.profileId eq cityExportInLocalDB.id }
                        EventDescriptions.deleteWhere { EventDescriptions.profileId eq cityExportInLocalDB.id }
                        Noticeboards.deleteWhere { Noticeboards.profileId eq cityExportInLocalDB.id }
                        Payments.deleteWhere { Payments.profileId eq cityExportInLocalDB.id }
                    }
                }

                val newProfileId = Profiles.insert {
                    it[status] = cityExport.status
                    it[url] = cityExport.url
                    it[name] = cityExport.name
                    it[email] = cityExport.email
                    it[ico] = cityExport.ico
                    it[dataBox] = cityExport.dataBox
                    it[eDesky] = cityExport.eDesky
                    it[mapaSamospravy] = cityExport.mapaSamospravy
                    it[gpsX] = cityExport.gpsX
                    it[gpsY] = cityExport.gpsY
                    it[main] = cityExport.main
                    it[avatarType] = cityExport.avatarType
                    it[tokenCode] = cityExport.tokenCode
                } get Profiles.id

                when (!cityExport.accounting.isNullOrEmpty()) {
                    true -> Accounting.batchInsert(cityExport.accounting) {
                        this[Accounting.profileId] = newProfileId
                        this[Accounting.amount] = it.amount
                        this[Accounting.type] = it.type
                        this[Accounting.paragraph] = it.paragraph
                        this[Accounting.item] = it.item
                        this[Accounting.unit] = it.unit
                        this[Accounting.event] = it.unit
                    }
                }

                when (!cityExport.contracts.isNullOrEmpty()) {
                    true -> Contracts.batchInsert(cityExport.contracts) {
                        this[Contracts.profileId] = newProfileId
                        this[Contracts.date] = it.date
                        this[Contracts.title] = it.title
                        this[Contracts.counterparty] = it.counterparty
                        this[Contracts.amount] = it.amount
                        this[Contracts.currency] = it.currency
                        this[Contracts.url] = it.url
                    }
                }

                when (!cityExport.years.isNullOrEmpty()) {
                    true -> Years.batchInsert(cityExport.years) {
                        this[Years.profileId] = newProfileId
                        this[Years.year] = it.year
                        this[Years.hidden] = it.hidden
                        this[Years.validity] = it.validity
                    }
                }

                cityExport.events?.forEach { event ->
                    val eventsId = Events.insert {
                        it[id] = event.id
                        it[profileId] = newProfileId
                        it[year] = event.year
                        it[name] = event.name
                        it[description] = event.description
                    } get Events.id

                    val eventDesc = event.eventDescription
                    if (eventDesc != null) {
                        EventDescriptions.insert {
                            it[profileId] = newProfileId
                            it[eventId] = eventsId
                            it[year] = eventDesc.year
                            it[category] = eventDesc.category
                            it[eventName] = eventDesc.eventName
                            it[organizationName] = eventDesc.organizationName
                            it[description] = eventDesc.description
                        }
                    }
                }

                when (!cityExport.noticeboards.isNullOrEmpty()) {
                    true -> Noticeboards.batchInsert(cityExport.noticeboards) {
                        this[Noticeboards.profileId] = newProfileId
                        this[Noticeboards.attachments] = it.attachments
                        this[Noticeboards.title] = it.title
                        this[Noticeboards.category] = it.category
                        this[Noticeboards.date] = it.date
                        this[Noticeboards.documentUrl] = it.documentUrl
                        this[Noticeboards.edeskyUrl] = it.edeskyUrl
                        this[Noticeboards.previewUrl] = it.previewUrl
                    }
                }

                when (!cityExport.payments.isNullOrEmpty()) {
                    true -> Payments.batchInsert(cityExport.payments) {
                        this[Payments.profileId] = newProfileId
                        this[Payments.amount] = it.amount
                        this[Payments.counterpartyId] = it.counterpartyId
                        this[Payments.counterpartyName] = it.counterpartyName
                        this[Payments.date] = it.date
                        this[Payments.description] = it.description
                        this[Payments.event] = it.event
                        this[Payments.item] = it.item
                        this[Payments.unit] = it.unit
                        this[Payments.year] = it.year
                        this[Payments.paragraph] = it.paragraph
                    }
                }
                commit()
                SyncResponse(newProfileId)
            }
        } catch (e: Exception) {
            throw IllegalStateException(e.message ?: "Unexpected error")
        }
    }

    private fun callInstance(syncTask: SyncTask): CityExport {
        val instanceUrl = config.instanceUrls[syncTask.instance] ?: throw CitySyncException(
            "instance of CV ${syncTask.instance} not found in configuration"
        )

        val uri = UriComponentsBuilder
            .fromHttpUrl(instanceUrl)
            .path("/api/v1/citysync/cities/${syncTask.cityId}")
            .build()
            .toUri()

        return restTemplate.getForObject(uri, CityExport::class.java)!!
    }
}
