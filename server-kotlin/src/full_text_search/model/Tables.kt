package full_text_search.model

import org.jetbrains.exposed.sql.Table

object Invoices : Table() {
    val id = integer("id").primaryKey().autoIncrement()
    val profile = varchar("profile", 50)
    val year = integer("year")
    val event = varchar("event", 50).nullable()
    val eventSrcId = varchar("event_src_id", 50).nullable()
    val type = varchar("type", 5)
    val item = integer("item")
    val paragraph = integer("paragraph")
    val date = date("date")
    val amount = double("amount")
    val counterpartyId = integer("counterparty_id").nullable()
    val counterpartyName = varchar("counterparty_name",100).nullable()
    val description = varchar("description", 500)
}