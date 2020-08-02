package digital.cesko.common

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.`java-time`.date

object Profiles : Table("app.profiles") {
    val id = integer("id").uniqueIndex().autoIncrement("profiles_id_seq")
    val status = text("status").default("hidden")
    val url = text("url").nullable()
    val name = text("name").nullable()
    val email = text("email").nullable()
    val ico = text("ico").nullable()
    val dataBox = text("databox").nullable()
    val eDesky = short("edesky").nullable()
    val mapaSamospravy = short("mapasamospravy").nullable()
    val gpsX = decimal("gps_x", 3, 38).nullable()
    val gpsY = decimal("gps_y", 3, 38).nullable()
    val main = bool("main").default(false)
    val avatarType = text("avatar_type").nullable()
    val tokenCode = integer("token_code").default(0)
}

object Accounting : Table("data.accounting") {
    val profileId = reference("profile_id", Profiles.id)
    val year = integer("year").nullable()
    val type = text("type").nullable()
    val paragraph = integer("paragraph").nullable()
    val item = integer("item").nullable()
    val unit = integer("unit").nullable()
    val event = integer("event").nullable()
    val amount = decimal("amount", 14, 2).nullable()
}

object Contracts : Table("data.contracts") {
    val id = integer("id").primaryKey().autoIncrement()
    val profileId = reference("profile_id", Profiles.id)
    val date = date("date").nullable()
    val title = text("title").nullable()
    val counterparty = text("counterparty").nullable()
    val amount = decimal("amount", 14, 2).nullable()
    val currency = text("currency").nullable()
    val url = text("url").nullable()
}

object Years : Table("app.years") {
    val profileId = reference("profile_id", Profiles.id)
    val year = integer("year")
    val hidden = bool("hidden").default(true)
    val validity = date("validity").nullable()
}

object Events : Table("data.events") {
    val id = integer("id")
    val profileId = reference("profile_id", Profiles.id)
    val year = integer("year")
    val name = text("name")
    val description = text("description").nullable()
}

object EventDescriptions : Table("data.event_descriptions") {
    val profileId = reference("profile_id", Profiles.id)
    val eventId = reference("event_id", Events.id)
    val year = integer("year")
    val category = text("category").nullable()
    val eventName = text("event_name").nullable()
    val organizationName = text("organization_name").nullable()
    val description = text("description").nullable()
}

object Noticeboards : Table("data.noticeboards") {
    val profileId = reference("profile_id", Profiles.id)
    val date = date("date").nullable()
    val title = text("title").nullable()
    val category = text("category").nullable()
    val documentUrl = text("document_url").nullable()
    val edeskyUrl = text("edesky_url").nullable()
    val previewUrl = text("preview_url").nullable()
    val attachments = integer("attachments").default(0)
}

object Payments : Table("data.payments") {
    val profileId = reference("profile_id", Profiles.id)
    val year = integer("year").nullable()
    val paragraph = integer("paragraph").nullable()
    val item = integer("item").nullable()
    val unit = integer("unit").nullable()
    val event = long("event").nullable()
    val amount = decimal("amount", 14, 2).nullable()
    val date = date("date").nullable()
    val counterpartyId = text("counterparty_id").nullable()
    val counterpartyName = text("counterparty_name").nullable()
    val description = text("description").nullable()
}
