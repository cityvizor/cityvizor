package digital.cesko.common

import org.apache.lucene.analysis.CharArraySet
import org.apache.lucene.analysis.LowerCaseFilter
import org.apache.lucene.analysis.StopFilter
import org.apache.lucene.analysis.StopwordAnalyzerBase
import org.apache.lucene.analysis.TokenStream
import org.apache.lucene.analysis.Tokenizer
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
