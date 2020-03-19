package city_request

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport
import com.google.api.client.http.HttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import com.google.api.services.sheets.v4.Sheets
import com.google.api.services.sheets.v4.SheetsScopes
import com.google.api.services.sheets.v4.model.Spreadsheet
import com.google.api.services.sheets.v4.model.ValueRange
import org.springframework.core.io.ClassPathResource
import java.io.IOException
import java.security.GeneralSecurityException

/**
 * Tool to create new sheet
 */
object CreateSheet {
    @Throws(IOException::class, GeneralSecurityException::class)
    @JvmStatic
    fun main(args: Array<String>) {
        val requestBody = Spreadsheet()
        val sheetsService = createSheetsService()
        val response = sheetsService.spreadsheets().create(requestBody).execute()

        val range = "Sheet1!A2:E2"

        val data = listOf(
            listOf(
                "a", "b", "c"
            )
        )

        val request = sheetsService.spreadsheets().values()
            .append(
                response.spreadsheetId,
                range,
                ValueRange().setValues(data)
            )
        request.valueInputOption = "USER_ENTERED"
        request.insertDataOption = "INSERT_ROWS"



        println(request.execute())
    }

    @Throws(IOException::class, GeneralSecurityException::class)
    fun createSheetsService(): Sheets {
        val httpTransport: HttpTransport = GoogleNetHttpTransport.newTrustedTransport()
        val jsonFactory = JacksonFactory.getDefaultInstance()

        val credential = GoogleCredential.fromStream(ClassPathResource("city_request/test-credentials.json").inputStream)
            .createScoped(listOf(SheetsScopes.SPREADSHEETS))
        return Sheets.Builder(httpTransport, jsonFactory, credential)
            .setApplicationName("Google-SheetsSample/0.1")
            .build()
    }
}
