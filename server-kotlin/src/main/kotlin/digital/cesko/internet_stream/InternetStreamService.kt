package digital.cesko.internet_stream

import digital.cesko.common.Payments
import digital.cesko.common.Profiles
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVParser
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.batchInsert
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.core.io.ResourceLoader
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.io.InputStream
import java.time.LocalDate
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream

/**
 * Downloads zipped budgets in .csv format, parses and saves to database
 *
 * Service which downloads file with budgets in .csv file, unzips it, parses it and
 * saves it into database.
 * Can be configured in application.properties
 * budgets.frequency - how often service executes default value is 60 minutes format is PT
 * budgets.baseUrls - url of open data folder for one city
 * budgets.fileUrls - name of zipped file in .csv file which contains budget
 * budgets.insertProfileIds - id of profileId into which insert parsed data from .csv, first entry is for city etc..
 * example of complete url: http://rozpocet.mestocernosice.cz/opendata/opendata_2020_CSV.zip
 */

@Service
@EnableConfigurationProperties(InternetStreamServiceConfiguration::class)
class InternetStreamService(
    configuration: InternetStreamServiceConfiguration,
    private val resourceLoader: ResourceLoader
) {
    private val csvFormat = CSVFormat.DEFAULT.withDelimiter(',').withFirstRecordAsHeader()
        .withIgnoreHeaderCase().withTrim()

    private val urls = configuration.urls
    private val fileUrls = configuration.fileUrls

    @Scheduled(
        fixedRateString = "\${internet.stream.service.configuration.frequency}",
        initialDelayString = "\${internet.stream.service.configuration.initDelay}"
    )
    fun fetchData() {
        urls.map {
            val cityUrl = it.key
            val budgetUrl = it.value
            if (!isProfileIdPresent(cityUrl))
                return

            val completeBudgetPerCity = fileUrls.map {
                val url = budgetUrl + it
                val budgetPerYear = fetchFile(url)

                budgetPerYear
            }

            val profileId = getProfileIdFromUrl(cityUrl)
            fileUrls.forEach {
                val year = it.replace("[^0-9]".toRegex(), "").toInt()
                deleteCityBudgetsPerYear(profileId, year)
            }
            completeBudgetPerCity.map {
                saveCityBudgets(profileId, it)
            }
        }
    }

    fun fetchFile(url: String): MutableList<Budget> {
        val budgets: MutableList<Budget> = mutableListOf()
        val downloadInputStream = resourceLoader.getResource(url).inputStream
        downloadInputStream.use {
            val zipInputStream = ZipInputStream(downloadInputStream)
            zipInputStream.use {
                var ze: ZipEntry? = zipInputStream.nextEntry
                while (ze != null) {
                    if (ze.name == "RU.csv" || ze.name == "SK.csv") {
                        val budget = parseBudgets(zipInputStream)
                        budgets.addAll(budget)
                    }
                    ze = zipInputStream.nextEntry
                }
            }
        }
        return budgets
    }

    fun isProfileIdPresent(url: String): Boolean {
        val profileId = transaction {
            Profiles.select { Profiles.url eq url }.toList()
        }
        return !profileId.isEmpty()
    }

    // Search by column url and return id
    fun getProfileIdFromUrl(url: String): Int {
        return transaction {
            Profiles.select { Profiles.url eq url }
                .map { it[Profiles.id] }
                .first()
        }
    }

    // Parses .csv file which is provided as ByteArray
    // returns list of parsed budgets
    fun parseBudgets(inputStream: InputStream): List<Budget> {
        val csvParser = CSVParser.parse(inputStream, Charsets.UTF_8, csvFormat)
        val records = csvParser.records
        return records.map {
            val type = it.get("DOKLAD_AGENDA")
            val paragraph = it.get("PARAGRAF").toInt()
            val item = it.get("POLOZKA").toInt()
            val srcId = it.get("ORGANIZACE")
            val name = it.get("ORGANIZACE_NAZEV")
            val amountMd = it.get("CASTKA_MD").toBigDecimal()
            val amountDal = it.get("CASTKA_DAL").toBigDecimal()
            val amount = if (item < 5000) (amountMd - amountDal) else (amountDal - amountMd)
            val event: Long? = it.get("ORGANIZACE").toLong()
            val unit: Int? = it.get("ORJ").toInt()
            val dateAsString: String? = it.get("DOKLAD_DATUM")
            val date: LocalDate? = if (dateAsString != null) LocalDate.parse(dateAsString) else null
            val counterpartyId: String? = it.get("DOKLAD_DATUM")
            val counterpartyName: String? = it.get("SUBJEKT_NAZEV")
            val description: String? = it.get("POZNAMKA")
            val year: Int? = it.get("DOKLAD_ROK").toInt()
            val budget = Budget(
                type, paragraph, item, srcId, name, amount, event, unit, date,
                counterpartyId, counterpartyName, description, year
            )
            budget
        }
    }

    fun deleteCityBudgetsPerYear(cityId: Int, year: Int) {
        transaction {
            Payments.deleteWhere { (Payments.profileId eq cityId) and (Payments.year eq year) }
        }
    }

    fun saveCityBudgets(cityId: Int, budgets: List<Budget>) {
        transaction {
            Payments.batchInsert(budgets) {
                this[Payments.profileId] = cityId
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
            commit()
        }
    }
}
