package cz.cityvizor.service

import cz.cityvizor.model.InvoiceLucineModel
import cz.cityvizor.model.InvoiceResultModel
import cz.cityvizor.model.Invoices
import cz.cityvizor.model.Invoices.amount
import cz.cityvizor.model.Invoices.counterpartyId
import cz.cityvizor.model.Invoices.counterpartyName
import cz.cityvizor.model.Invoices.date
import cz.cityvizor.model.Invoices.description
import cz.cityvizor.model.Invoices.event
import cz.cityvizor.model.Invoices.eventSrcId
import cz.cityvizor.model.Invoices.id
import cz.cityvizor.model.Invoices.item
import cz.cityvizor.model.Invoices.paragraph
import cz.cityvizor.model.Invoices.profile
import cz.cityvizor.model.Invoices.type
import cz.cityvizor.model.Invoices.year
import cz.cityvizor.model.ResultModel
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