package digital.cesko.city_request

import akka.actor.UntypedAbstractActor


class CityRequestActor(private val requestStore: CityRequestStore) : UntypedAbstractActor() {

    override fun onReceive(message: Any?) {
        if (message is CityRequest) {
            requestStore.insert(message);
        }
    }
}