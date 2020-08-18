package digital.cesko.internet_stream

import digital.cesko.city_sync.exception.CitySyncException
import digital.cesko.city_sync.model.CityExport
import digital.cesko.city_sync.model.toProfileCityExport
import digital.cesko.common.Payments
import digital.cesko.common.Profiles
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVParser
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.batchInsert
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.io.InputStream
import java.net.MalformedURLException
import java.net.URL
import java.time.LocalDate
import java.time.format.DateTimeParseException
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
class InternetStreamService() {
    val csvFormat = CSVFormat.DEFAULT.withDelimiter(';').withFirstRecordAsHeader()
            .withIgnoreHeaderCase().withTrim()

    @Value("\${budgets.baseSourceUrls}") val baseUrls: MutableList<String> = mutableListOf()
    @Value("\${budgets.fileUrls}") val fileUrls: MutableList<String> = mutableListOf()
    @Value("\${budgets.cityUrls}") val cityUrls: MutableList<String> = mutableListOf()
    val bufferSize = 8192

    @Scheduled(fixedRateString = "\${budgets.frequency}")
    fun fetchData() {
        val profileIds = getProfilesIds()

        for ((index,baseUrl) in baseUrls.withIndex()) {
            val completeBudgetPerCity: MutableList<Budget> = mutableListOf()
            val cityId = profileIds[index]
            for (fileUrl in fileUrls) {
                var zipInputStream: ZipInputStream? = null
                var downloadInputStream: InputStream? = null
                val budgetPerYear: MutableList<Budget> = mutableListOf()
                var url: String? = null
                try {
                    url = baseUrl + fileUrl
                    val downloadUrl = URL(url)
                    downloadInputStream = downloadUrl.openStream()
                    zipInputStream = ZipInputStream(downloadInputStream)
                    var ze: ZipEntry? = zipInputStream.nextEntry
                    while (ze != null) {
                        if (ze.name == "RU.csv" || ze.name == "SK.csv") {
                            val byteArray = unzipFromStream(zipInputStream)
                            val budget = parseBudgets(byteArray)
                            budgetPerYear.addAll(budget)
                        }
                        ze = zipInputStream.nextEntry
                    }
                    completeBudgetPerCity.addAll(budgetPerYear)
                } catch (malformedUrl: MalformedURLException) {
                    logger.error("Unable to download budgets from $url", malformedUrl)
                } catch (ioException: IOException) {
                    logger.error("Unable to process budgets from $url", ioException)
                } finally {
                    zipInputStream?.close()
                    downloadInputStream?.close()
                }
            }
            deleteCityBudgets(cityId)
            saveCityBudgets(cityId, completeBudgetPerCity)
            completeBudgetPerCity.clear()
        }
    }

    // Get profile_id of every city defined in application.properties.
    // Search is made by column url.
    fun getProfilesIds(): MutableList<Int> {
        val profileIds: MutableList<Int> = mutableListOf()
        for (cityUrl in cityUrls) {
            val resultRow: CityExport = transaction {
                Profiles.select { Profiles.url eq cityUrl }
                        .map { toProfileCityExport(it) }
                        .ifEmpty { throw Exception("CityUrl $cityUrl not found.") }
                        .first()
            }
            profileIds.add(resultRow.id)
        }
        return profileIds
    }

    fun unzipFromStream(inputStream: ZipInputStream): ByteArray {
        val stream = ByteArrayOutputStream()
        val buffer = ByteArray(bufferSize)
        var byteArray = ByteArray(0)
        try {
            var count = inputStream.read(buffer)
            while (count != -1) {
                stream.write(buffer, 0, count)
                count = inputStream.read(buffer)
            }
            byteArray = stream.toByteArray()
        } catch (ioException: IOException) {
            logger.error("Unable to unzip: ", ioException)
        } finally {
            stream.close()
        }
        return byteArray
    }

    // Parses .csv file which is provided as ByteArray
    // returns list of parsed budgets
    fun parseBudgets(byteArray: ByteArray): MutableList<Budget> {
        val completeBudget: MutableList<Budget> = mutableListOf()
        var inputStream: ByteArrayInputStream? = null
        try {
            inputStream = byteArray.inputStream()
            val csvParser = CSVParser.parse(inputStream, Charsets.UTF_8, csvFormat)
            val records = csvParser.records
            records.forEach { csvRecord ->
                val type = csvRecord.get("DOKLAD_AGENDA")
                val paragraph = csvRecord.get("PARAGRAF").toInt()
                val item = csvRecord.get("POLOZKA").toInt()
                val srcId = csvRecord.get("ORGANIZACE")
                val name = csvRecord.get("ORGANIZACE_NAZEV")
                val amountMd = csvRecord.get("CASTKA_MD").toBigDecimal()
                val amountDal = csvRecord.get("CASTKA_DAL").toBigDecimal()
                val amount = if (item < 5000) (amountMd - amountDal) else (amountDal - amountMd)

                val event: Long? = csvRecord.get("ORGANIZACE").toLong()
                val unit: Int? = csvRecord.get("ORJ").toInt()
                val dateAsString: String? = csvRecord.get("DOKLAD_DATUM")
                val date: LocalDate? = if (dateAsString != null) LocalDate.parse(dateAsString) else null
                val counterpartyId: String? = csvRecord.get("DOKLAD_DATUM")
                val counterpartyName: String? = csvRecord.get("SUBJEKT_NAZEV")
                val description: String? = csvRecord.get("POZNAMKA")
                val year: Int? = csvRecord.get("DOKLAD_ROK").toInt()
                val budget = Budget(type, paragraph, item, srcId, name, amount, event, unit, date,
                        counterpartyId, counterpartyName, description, year)
                completeBudget.add(budget)
            }
        } catch (ioException: IOException) {
            logger.error("Unable to parse csv: ", ioException)
        } catch (numberFormatException: NumberFormatException) {
            logger.error("Invalid number format in csv: ", numberFormatException)
        } catch (dateParseException: DateTimeParseException) {
            logger.error("Invalid date format in csv: ", dateParseException)
        } finally {
            inputStream?.close()
        }
        return completeBudget
    }

    fun deleteCityBudgets(cityId: Int) {
        transaction {
            Payments.deleteWhere { Payments.profileId eq cityId }
            commit()
        }
    }

    fun saveCityBudgets(cityId: Int, budgets: MutableList<Budget>) {
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

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(this::class.java)
    }
}