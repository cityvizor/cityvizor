package digital.cesko.city_request

import javax.annotation.ParametersAreNonnullByDefault

@ParametersAreNonnullByDefault
interface CityRequestStore {

    fun insert(cityRequest: CityRequest)
}