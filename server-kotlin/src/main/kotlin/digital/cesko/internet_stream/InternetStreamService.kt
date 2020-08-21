package digital.cesko.internet_stream

import digital.cesko.common.Payments
import digital.cesko.common.Profiles
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVParser
import org.jetbrains.exposed.sql.batchInsert
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.io.ByteArrayOutputStream
import java.net.URL
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
class InternetStreamService(configuration: InternetStreamServiceConfiguration) {
    val csvFormat = CSVFormat.DEFAULT.withDelimiter(';').withFirstRecordAsHeader()
        .withIgnoreHeaderCase().withTrim()

    val urls = configuration.urls
    var fileUrls = configuration.fileUrls
    val bufferSize = 8192

    @Scheduled(fixedRateString = "\${internet.stream.service.configuration.frequency}")
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
            deleteCityBudgets(profileId)
            completeBudgetPerCity.map {
                saveCityBudgets(profileId, it)
            }
        }
    }

    fun fetchFile(url: String): MutableList<Budget> {
        var budgets: MutableList<Budget> = mutableListOf()
        val downloadUrl = URL(url)
        val downloadInputStream = downloadUrl.openStream()
        downloadInputStream.use {
            val zipInputStream = ZipInputStream(downloadInputStream)
            zipInputStream.use {
                var ze: ZipEntry? = zipInputStream.nextEntry
                while (ze != null) {
                    if (ze.name == "RU.csv" || ze.name == "SK.csv") {
                        val stream = ByteArrayOutputStream()
                        val buffer = ByteArray(bufferSize)
                        var byteArray: ByteArray
                        var count = zipInputStream.read(buffer)
                        while (count != -1) {
                            stream.write(buffer, 0, count)
                            count = zipInputStream.read(buffer)
                        }
                        byteArray = stream.toByteArray()
                        val budget = parseBudgets(byteArray)
                        budgets.addAll(budget)
                    }
                    ze = zipInputStream.nextEntry
                }
            }
        }
        return budgets
    }

    fun isProfileIdPresent(url: String): Boolean {
        var profileId = transaction {
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
    fun parseBudgets(byteArray: ByteArray): List<Budget> {
        var completeBudget: List<Budget> = listOf()
        byteArray.inputStream().use {
            val csvParser = CSVParser.parse(it, Charsets.UTF_8, csvFormat)
            val records = csvParser.records
            completeBudget = records.map {
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
        return completeBudget
    }

    fun deleteCityBudgets(cityId: Int) {
        transaction {
            Payments.deleteWhere { Payments.profileId eq cityId }
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
