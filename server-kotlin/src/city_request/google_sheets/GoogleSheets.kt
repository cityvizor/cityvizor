package digital.cesko.city_request.google_sheets

import com.google.api.client.auth.oauth2.Credential
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport
import com.google.api.client.http.HttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import com.google.api.client.util.store.FileDataStoreFactory
import com.google.api.services.sheets.v4.Sheets
import com.google.api.services.sheets.v4.SheetsScopes
import com.google.api.services.sheets.v4.model.ValueRange
import digital.cesko.city_request.CityRequest
import digital.cesko.city_request.CityRequestStore
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.File
import java.io.IOException
import java.io.InputStreamReader

/**
 * Google sheets API v4 implementation of CityRequestStore
 *
 * @param credentialsFile json file on a disk which contains google credentials, namely client_id and client_secret
 * @param documentId google sheet document ID (visible in URL)
 * @param listName name of a list on a sheet which contains the data
 */
internal class GoogleSheets(
    private val credentialsFile: String?,
    private val documentId: String,
    private val listName: String
) : CityRequestStore {

    override fun insert(cityRequest: CityRequest) {

        // in case of no credentials file (testing env., local development, ...) just fail silently
        if (credentialsFile.isNullOrBlank()) {
            logger.warn("No credentials file.")
            return
        }

        try {
            val credentials = getCredentials(httpTransport, File(credentialsFile))

            val range = "${listName}!A2:E2"
            val service = Sheets.Builder(httpTransport, jacksonFactory, credentials)
                .setApplicationName(appName)
                .build()

            val data = listOf(
                listOf(
                    cityRequest.city,
                    cityRequest.email,
                    cityRequest.name,
                    cityRequest.subscribe,
                    cityRequest.gdpr
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
            logger.error("Unable to create new city request from $cityRequest", e);
        }
    }


    @Throws(IOException::class)
    private fun getCredentials(httpTransport: HttpTransport, credentialFile: File): Credential? {
        val clientSecrets = GoogleClientSecrets.load(
            jacksonFactory,
            InputStreamReader(credentialFile.inputStream())
        )

        val flow = GoogleAuthorizationCodeFlow.Builder(
            httpTransport,
            jacksonFactory,
            clientSecrets,
            listOf(SheetsScopes.SPREADSHEETS)
        )
            .setDataStoreFactory(FileDataStoreFactory(File("tokens")))
            .setAccessType("offline")
            .build()
        val receiver = LocalServerReceiver.Builder().setPort(8881).build()
        return AuthorizationCodeInstalledApp(flow, receiver).authorize("user")
    }

    companion object {
        private const val appName = "CityVizor"
        private val logger: Logger = LoggerFactory.getLogger(this::class.java)
        private val jacksonFactory: JacksonFactory = JacksonFactory.getDefaultInstance()
        private val httpTransport = GoogleNetHttpTransport.newTrustedTransport()
    }
}

