package cz.cityvizor.model

import java.lang.RuntimeException

class FTSException(override val message: String) : RuntimeException(message)