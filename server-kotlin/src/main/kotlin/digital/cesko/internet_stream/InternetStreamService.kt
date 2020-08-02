package digital.cesko.internet_stream

import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVParser
import org.jetbrains.exposed.sql.batchInsert
import org.jetbrains.exposed.sql.deleteAll
import org.springframework.stereotype.Service
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.scheduling.annotation.Scheduled
import java.io.IOException
import java.net.URL
import java.time.LocalDate

/**
 * Downloads budgets in .csv format, parses and saves to database
 *
 * Service which downloads file with budgets in .csv file, parses it and
 * saves it into database.
 * Can be configured in application.properties
 * budgets.frequency - how often service executes default value is 60 minutes format is PT
 * budgets.sourceUrl - url with location of budget file in .csv format
 */
@Service
class InternetStreamService() {
    @Value("\${budgets.sourceUrl}") val sourceUrl: String = ""
    val csvFormat = CSVFormat.DEFAULT.withDelimiter(';').withFirstRecordAsHeader()
            .withIgnoreHeaderCase().withTrim()

    @Scheduled(fixedRateString = "\${budgets.frequency}")
    fun fetchData() {
        val downloadUrl = URL(sourceUrl)
        try {
            val csvParser = CSVParser.parse(downloadUrl, Charsets.UTF_8, csvFormat)
            val completeBudget: MutableList<Budget> = mutableListOf()
            for (csvRecord in csvParser) {
                val type = csvRecord.get("DOKLAD_AGENDA")
                val paragraph = csvRecord.get("PARAGRAF").toInt()
                val item = csvRecord.get("POLOZKA").toInt()
                val src_id = csvRecord.get("ORGANIZACE")
                val name = csvRecord.get("ORGANIZACE_NAZEV")
                val amountMd = csvRecord.get("CASTKA_MD").toBigDecimal()
                val amountDal = csvRecord.get("CASTKA_DAL").toBigDecimal()
                val amount = if (item < 5000) (amountMd - amountDal) else (amountDal - amountMd)

                val event: Int? = csvRecord.get("ORGANIZACE").toInt()
                val unit: Int? = csvRecord.get("ORJ").toInt()
                val dateAsString: String? = csvRecord.get("DOKLAD_DATUM")
                val date: LocalDate? = if (dateAsString != null) LocalDate.parse(dateAsString) else null
                val counterparty_id: String? = csvRecord.get("DOKLAD_DATUM")
                val counterparty_name: String? = csvRecord.get("SUBJEKT_NAZEV")
                val description: String? = csvRecord.get("POZNAMKA")
                val budget = Budget(type, paragraph, item, src_id, name, amount, event, unit, date,
                        counterparty_id, counterparty_name, description)
                completeBudget.add(budget)
            }
            deleteAllBudgets()
            saveBudgets(completeBudget)
        } catch (e: IOException) {
            logger.error("Unable to process budgets from $sourceUrl", e)
        }
    }

    fun deleteAllBudgets() {
        transaction {
            Budgets.deleteAll()
        }
    }

    fun saveBudgets(budgets: MutableList<Budget>) {
        transaction {
            Budgets.batchInsert(budgets) {
                this[Budgets.type] = it.type
                this[Budgets.paragraph] = it.paragraph
                this[Budgets.src_id] = it.src_id
                this[Budgets.name] = it.name
                this[Budgets.amount] = it.amount
                this[Budgets.event] = it.event
                this[Budgets.unit] = it.unit
                this[Budgets.date] = it.date
                this[Budgets.counterparty_id] = it.counterparty_id
                this[Budgets.counterparty_name] = it.counterparty_name
                this[Budgets.description] = it.description
            }
        }
    }

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(this::class.java)
    }
}