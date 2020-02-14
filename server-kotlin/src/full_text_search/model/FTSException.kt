package full_text_search.model

import java.lang.RuntimeException

class FTSException(override val message: String) : RuntimeException(message)