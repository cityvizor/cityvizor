package digital.cesko.city_request


import akka.actor.ActorSelection
import akka.actor.ActorSystem
import akka.actor.Props
import digital.cesko.city_request.google_sheets.GoogleSheets

object CityRequestActors {
    private lateinit var actorSystem: ActorSystem

    fun create(actorSystem: ActorSystem) {
        actorSystem.actorOf(Props.create {
            CityRequestActor(createGoogleSheetsStore())
        }, CityRequestActor::class.simpleName)
        this.actorSystem = actorSystem
    }

    fun get(): ActorSelection? {
        if (!this::actorSystem.isInitialized) {
            return null
        }

        return actorSystem.actorSelection("/user/" + CityRequestActor::class.simpleName)
    }

    private fun createGoogleSheetsStore(): GoogleSheets {
        val documentId = "12SM9gbOlKG2OnplHryuhx9oGAQh3JHGumSZVU7g4Gzo"
        val listName = "Seznam"

        return GoogleSheets(
            System.getProperty("googleCredentials"),
            documentId,
            listName
        )
    }
}