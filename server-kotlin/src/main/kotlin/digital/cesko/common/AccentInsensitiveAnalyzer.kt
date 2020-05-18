package digital.cesko.common

import org.apache.lucene.analysis.*
import org.apache.lucene.analysis.miscellaneous.ASCIIFoldingFilter
import org.apache.lucene.analysis.standard.StandardTokenizer

class AccentInsensitiveAnalyzer : StopwordAnalyzerBase(CharArraySet.EMPTY_SET) {
    override fun createComponents(fieldName: String?): TokenStreamComponents {
        val source: Tokenizer = StandardTokenizer()
        var tokenStream: TokenStream? = source
        tokenStream = LowerCaseFilter(tokenStream)
        tokenStream = StopFilter(tokenStream, stopwordSet)
        tokenStream = ASCIIFoldingFilter(tokenStream)
        return TokenStreamComponents(source, tokenStream)
    }
}