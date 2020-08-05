package digital.cesko.city_request.google_sheets

import com.google.api.client.auth.oauth2.Credential
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import com.google.api.services.sheets.v4.Sheets
import com.google.api.services.sheets.v4.SheetsScopes
import com.google.api.services.sheets.v4.model.ValueRange
import digital.cesko.city_request.CityRequest
import digital.cesko.city_request.CityRequestStore
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.Resource
import org.springframework.stereotype.Component
import java.io.IOException
import java.time.format.DateTimeFormatter


/**
 * Google sheets API v4 implementation of CityRequestStore
 *
 * @param credentialsFile json file on a disk which contains google credentials, namely client_id and client_secret
 * @param documentId google sheet document ID (visible in URL)
 * @param listName name of a list on a sheet which contains the data
 */
@Component
internal class GoogleSheets(
    @Value("\${googleCredentials:}") private val credentialsFile: Resource?,
    @Value("\${city-request.sheetId}") private val documentId: String,
    @Value("\${city-request.listName}") private val listName: String,
    @Value("\${city-request.appName}") private val appName: String
) : CityRequestStore {

    override fun insert(cityRequest: CityRequest) {

        // in case of no credentials file (testing env., local development, ...) just fail silently
        if (credentialsFile == null) {
            logger.warn("No credentials file. Append `-DgoogleCredentials=/path/to/file.json` argument to a process.")
            return
        }

        try {
            val range = "${listName}!A2:E2"
            val service = Sheets.Builder(httpTransport, jacksonFactory, getCredentials(credentialsFile))
                .setApplicationName(appName)
                .build()

            val data = listOf(
                listOf(
                    cityRequest.time?.format(dateFormatter) ?: "",
                    cityRequest.city,
                    cityRequest.email,
                    cityRequest.name,
                    cityRequest.subscribe,
                    cityRequest.gdpr,
                    cityRequest.ip ?: "",
                    cityRequest.occupation ?: "",
                    cityRequest.psc ?: ""
                )
            )

            val request = service.spreadsheets().values()
                .append(
                    documentId,
                    range,
                    ValueRange().setValues(data)
                )
            request.valueInputOption = "USER_ENTERED"
            request.insertDataOption = "INSERT_ROWS"

            request.execute()
        } catch (e: Exception) {
            logger.error("Unable to create new city request from $cityRequest", e)
            throw RuntimeException(e)
        }
    }

    @Throws(IOException::class)
    private fun getCredentials(credentialsFile: Resource): Credential {
        return GoogleCredential.fromStream(credentialsFile.inputStream)
                .createScoped(listOf(SheetsScopes.SPREADSHEETS))
    }

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(this::class.java)
        private val jacksonFactory: JacksonFactory = JacksonFactory.getDefaultInstance()
        private val httpTransport = GoogleNetHttpTransport.newTrustedTransport()
        private val dateFormatter : DateTimeFormatter =  DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")

    }
}

