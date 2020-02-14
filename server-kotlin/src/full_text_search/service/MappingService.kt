package full_text_search.service

import full_text_search.model.InvoiceLucineModel
import full_text_search.model.InvoiceResultModel
import full_text_search.model.Invoices
import full_text_search.model.Invoices.amount
import full_text_search.model.Invoices.counterpartyId
import full_text_search.model.Invoices.counterpartyName
import full_text_search.model.Invoices.date
import full_text_search.model.Invoices.description
import full_text_search.model.Invoices.event
import full_text_search.model.Invoices.eventSrcId
import full_text_search.model.Invoices.id
import full_text_search.model.Invoices.item
import full_text_search.model.Invoices.paragraph
import full_text_search.model.Invoices.profile
import full_text_search.model.Invoices.type
import full_text_search.model.Invoices.year
import full_text_search.model.ResultModel
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction

fun combineLucineAndDBData(lucineData: List<InvoiceLucineModel>): ResultModel {
    return ResultModel(
        lucineData.map { lucine ->
            transaction {
                val invoice = Invoices.select {
                    id.eq(lucine.id)
                }.first()
                InvoiceResultModel(
                    id = invoice[id],
                    profile = invoice[profile],
                    year = invoice[year],
                    event = invoice[event],
                    eventSrcId = invoice[eventSrcId],
                    type = invoice[type],
                    item = invoice[item],
                    paragraph = invoice[paragraph],
                    date = invoice[date].toLocalDate(),
                    amount = invoice[amount],
                    counterpartyId = invoice[counterpartyId],
                    counterpartyName = invoice[counterpartyName],
                    description = invoice[description]
                )
            }
        })

}