package digital.cesko.city_search

import akka.actor.ActorSelection
import akka.actor.ActorSystem
import akka.actor.Props

object CitySearchService {
    private lateinit var actorSystem: ActorSystem

    fun create(actorSystem: ActorSystem) {
        actorSystem.actorOf(Props.create(CitySearchIndex::class.java), "CitySearchService")
        this.actorSystem = actorSystem
    }

    fun get(): ActorSelection? {
        if (!this::actorSystem.isInitialized) {
            return null
        }

        return actorSystem.actorSelection("/user/CitySearchService")
    }
}