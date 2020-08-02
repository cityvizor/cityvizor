package digital.cesko.internet_stream
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.`java-time`.date

object Budgets : IntIdTable("app.budgets") {
    val type = text("type")
    val paragraph = integer("paragraph")
    val src_id = text("src_id")
    val name = text("name")
    val amount = decimal("amount", 14, 2)
    val event = integer("event").nullable()
    val unit = integer("unit").nullable()
    val date = date("date").nullable()
    val counterparty_id = text("counterparty_id").nullable()
    val counterparty_name = text("counterparty_name").nullable()
    val description = text("description").nullable()
}