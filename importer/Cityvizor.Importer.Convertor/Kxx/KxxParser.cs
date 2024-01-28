using Cityvizor.Importer.Convertor.Kxx.Dtos.Enums;
using Cityvizor.Importer.Convertor.Kxx.Dtos;
using Cityvizor.Importer.Convertor.Kxx.Helpers;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;

[assembly: InternalsVisibleTo("Cityvizor.Importer.UnitTests")]

namespace Cityvizor.Importer.Convertor.Kxx;
public class KxxParser
{
    const int _headerLineMinimalLength = 20;
    const int _documentBlockHeaderMinimalLength = 22;
    const int _documentNumberLen = 9;

    ulong _lineCounter = 1;
    bool _parsingFinished = false;
    private readonly StreamReader _stream;

    KxxHeader? _fileHeader;
    uint? _fileAccountingYear = null;

    public KxxParser(StreamReader stream)
    {
        this._stream = stream;
    }

    //public Document[] Parse() // TODO: return stream somehow
    //{
    //    if (_parsingFinished)
    //    {
    //        throw new KxxParserException("This instance of parser already finished parsing its stream. Cannot use the same KxxParser instance multiple times.");
    //    }

    //    string headerLine = _stream.ReadLine() ?? throw new KxxParserException("Trying to parse empty .kxx file.");
    //    _fileHeader = ParseKxxHeader(headerLine);


    //}

    /// <summary>
    /// Parses line 5/@ of .kxx file - header of the whole .kxx file
    /// 5/@xxxxxxxx00yy000cccc 
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    internal KxxHeader ParseKxxHeader(string input)
    {
        input = input.Trim();
        if (input.Length < _headerLineMinimalLength)
        {
            ThrowParserException($".kxx file header {input} is too short. Length: {input.Length}. Expected at least {_headerLineMinimalLength} characters.");
        }

        const int licenceLen = 4;
        const int secondDelimiterLen = 3;
        const int monthLen = 2;
        const int firstDelimiterLen = 2;

        string pattern = $@"^5/@([0-9]{{8,10}})(0{{{firstDelimiterLen}}})([0-9]{{{monthLen}}})(0{{{secondDelimiterLen}}})([A-Z]{{{licenceLen}}})$";
        Match match = Regex.Match(input, pattern);
        if (!match.Success) 
        {
            ThrowParserException($" invalid format of 5/@ line. Found: {input}. Expected format: 5/@xxxxxxxx00yy000cccc");
        }
        string ico = match.Groups[1].Value;

        if (!byte.TryParse(match.Groups[3].Value, out byte month))
        {
            ThrowParserException($" invalid format of 5/@ line. Failed to parse month {match.Groups[3].Value}");
        }

        string licence = match.Groups[5].Value;

        return new KxxHeader(Ico: ico, Month: month, ProgramLicence: licence);
    }

    /// <summary>
    /// Represents line 6/@ of .kxx file - header of a block representing one document (invoice?)
    /// 6/@xxxxxxxxyyzz_t_rrrr 
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    internal KxxDocumentBlockHeader ParseKxxDocumentBlockHeader(string input)
    {
        input = input.Trim();
        if (input.Length < _documentBlockHeaderMinimalLength)
        {
            ThrowParserException(".kxx file header {input} is too short. Length: {input.Length}. Expected at least {_headerLineMinimalLength} characters.");
        }

        const int monthLen = 2;
        const int documentTypeLen = 2;
        const int inputIndetifierLen = 1;
        const int accountingYearLen = 4;

        string pattern = $@"^6/@([0-9]{{8,10}})([0-9]{{{monthLen}}})([0-9]{{{documentTypeLen}}}) ([0-9]{{{inputIndetifierLen}}}) ([0-9]{{{accountingYearLen}}})$";
        Match match = Regex.Match(input, pattern);
        if(!match.Success) 
        {
            ThrowParserException($"invalid format of 6/@ line. Found: {input}. Expected format: 6/@xxxxxxxxyyzz_t_rrrr ");
        }

        string ico = match.Groups[1].Value;
        if (!byte.TryParse(match.Groups[2].Value, out byte month))
        {
            ThrowParserException($"invalid format of 6/@ line. Failed to parse month {match.Groups[2].Value}");
        }

        if (!Enum.TryParse(match.Groups[3].Value, out DocumentType documentType))
        {
            ThrowParserException($"invalid format of 6/@ line. Failed to parse document type {match.Groups[3].Value}");
        }

        if (!ParserHelpers.TryParseInputIndetifier(match.Groups[4].Value, out InputIndetifier? inputIndetifier))
        {
            ThrowParserException($"invalid format of 6/@ line. Failed to parse input identifier {match.Groups[4].Value}");
        }

        if (!uint.TryParse(match.Groups[5].Value, out uint accoutingYear))
        {
            ThrowParserException($"invalid format of 6/@ line. Failed to parse accounting year {match.Groups[5].Value}");
        }

        return new KxxDocumentBlockHeader(Ico: ico, Month: month, DocumentType: documentType, InputIndetifier: inputIndetifier.Value, AccountingYear: accoutingYear);
    }

    /// <summary>
    /// Parses G/@ line of .kxx file - one item in document (invoice)
    /// G/@ddccccccccc000sssaaaakkoooooollllzzzuuuuuuuuujjjjjjjjjjgggggggggggggmmmmmmmmmmmmmmmmmm_dddddddddddddddddd_
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    internal KxxDocumentLine ParseKxxDocumentLine(string input)
    {
        const int dayLen = 2;
        const int delimiterLen = 3;
        const int synteticLen = 3;
        const int analyticLen = 4;
        const int chapterLen = 2;
        const int paragraphLen = 6;
        const int itemLen = 4;
        const int recordUnitLen = 3;
        const int purposeMarkLen = 9;
        const int oraganizationUnitLen = 10;
        const int organizationLen = 13;
        const int shouldGiveLen = 18;
        const int gaveLen = 18;

        string pattern = $@"^G/@([0-9]{{{dayLen}}})(.{{{_documentNumberLen}}})(0{{{delimiterLen}}})([0-9]{{{synteticLen}}})([0-9]{{{analyticLen}}})([0-9]{{{chapterLen}}})([0-9]{{{paragraphLen}}})([0-9]{{{itemLen}}})([0-9]{{{recordUnitLen}}})([0-9]{{{purposeMarkLen}}})([0-9]{{{oraganizationUnitLen}}})([0-9]{{{organizationLen}}})([0-9]{{{shouldGiveLen}}})([ cC-]{{1}})([0-9]{{{gaveLen}}})([ cC-]{{1}})$";
        Match match = Regex.Match(input, pattern);

        if (!match.Success)
        {
            ThrowParserException($"invalid format of G/@ line. Found: {input}. Expected format: G/@ddccccccccc000sssaaaakkoooooollllzzzuuuuuuuuujjjjjjjjjjgggggggggggggmmmmmmmmmmmmmmmmmm_dddddddddddddddddd_");
        }
        if (!byte.TryParse(match.Groups[1].Value, out byte accountedDay))
        {
            ThrowParserException($"invalid format of G/@ line. Failed to parse accounted day {match.Groups[1].Value}");
        }
        if (!uint.TryParse(match.Groups[2].Value, out uint documentNumber))
        {
            ThrowParserException($"invalid format of G/@ line. Failed to parse document number {match.Groups[2].Value}");
        }
        // 000 delimiter
        if (!uint.TryParse(match.Groups[4].Value, out uint synteticAccount))
        {
            ThrowParserException($"invalid format of G/@ line. Failed to parse syntetic account {match.Groups[4].Value}");
        }
        if (!uint.TryParse(match.Groups[5].Value, out uint analyticAccount))
        {
            ThrowParserException($"invalid format of G/@ line. Failed to parse document number {match.Groups[5].Value}");
        }
        if (!uint.TryParse(match.Groups[6].Value, out uint chapter))
        {
            ThrowParserException($"invalid format of G/@ line. Failed to parse chapter {match.Groups[6].Value}");
        }
        if (!uint.TryParse(match.Groups[7].Value, out uint paragraph))
        {
            ThrowParserException($"invalid format of G/@ line. Failed to parse paragraph {match.Groups[7].Value}");
        }
        if (!uint.TryParse(match.Groups[8].Value, out uint item))
        {
            ThrowParserException($"invalid format of G/@ line. Failed to parse item {match.Groups[8].Value}");
        }
        if (!uint.TryParse(match.Groups[9].Value, out uint recordUnit))
        {
            ThrowParserException($"invalid format of G/@ line. Failed to parse record unit {match.Groups[9].Value}");
        }
        if (!uint.TryParse(match.Groups[10].Value, out uint purposeMark))
        {
            ThrowParserException($"invalid format of G/@ line. Failed to parse purpose mark {match.Groups[10].Value}");
        }
        if (!ulong.TryParse(match.Groups[11].Value, out ulong organizaionUnit))
        {
            ThrowParserException($"invalid format of G/@ line. Failed to parse organization unit {match.Groups[11].Value}");
        }
        if (!ulong.TryParse(match.Groups[12].Value, out ulong organization))
        {
            ThrowParserException($"invalid format of G/@ line. Failed to parse organization {match.Groups[12].Value}");
        }
        if (!ParserHelpers.TryParseAmount(match.Groups[13].Value, match.Groups[14].Value, out decimal? shouldGive))
        {
            ThrowParserException($"invalid format of G/@ line. Failed to should give amount {match.Groups[14].Value} {match.Groups[13].Value}");
        }
        if (!ParserHelpers.TryParseAmount(match.Groups[15].Value, match.Groups[16].Value, out decimal? gave))
        {
            ThrowParserException($"invalid format of G/@ line. Failed to gave amount {match.Groups[15].Value} {match.Groups[16].Value}");
        }
        return new KxxDocumentLine(
            AccountedDay: accountedDay,
            DocumentNumber: documentNumber,
            SynteticAccount: synteticAccount,
            AnalyticAccount: analyticAccount,
            Chapter: chapter,
            Paraghraph: paragraph,
            Item: item,
            RecordUnit: recordUnit,
            PurposeMark: purposeMark,
            OrganizationUnit: organizaionUnit,
            Organization: organization,
            ShouldGive: shouldGive.Value,
            Gave: gave.Value);
    }

    /// <summary>
    ///  Represents G/$ line in .kxx file - document line description
    /// G/$rrrrccccccccctttttttttttttttttttttttttttttttttttttttt...
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    internal KxxDocumentLineDescription ParseKxxDocumentLineDescription(string input)
    {
        const int lineNumLen = 4;

        string pattern = $@"^G/\$([0-9]{{{lineNumLen}}})(.{{{_documentNumberLen}}})(.+)$";
        Match match = Regex.Match(input, pattern);

        if (!match.Success)
        {
            ThrowParserException($"invalid format of G/$ line. Found: {input}. Expected format: G/$rrrrccccccccctttttttttttttttttttttttttttttttttttttttt...");
        }

        if (!uint.TryParse(match.Groups[1].Value, out uint lineNum))
        {
            ThrowParserException($"invalid format of G/$ line. Failed to parse line number {match.Groups[1].Value}");
        }
        if (!uint.TryParse(match.Groups[2].Value, out uint documentNumber))
        {
            ThrowParserException($"invalid format of G/@ line. Failed to parse document number {match.Groups[2].Value}");
        }
        string description = match.Groups[3].Value;

        return new KxxDocumentLineDescription(
            DocumentLineNumber: lineNum,
            DocumentNumber: documentNumber,
            LineDescription: description);
    }

    /// <summary>
    /// Parses G/# line in .kxx file - document description
    /// G/$rrrrccccccccctttttttttttttttttttttttttttttttttttttttt...
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    internal KxxDocumentDescription ParseKxxDocumentDescription(string input)
    {
        const int lineNumLen = 4;

        string pattern = $@"^G/#([0-9]{{{lineNumLen}}})(.{{{_documentNumberLen}}})(.+)$";
        Match match = Regex.Match(input, pattern);

        if (!match.Success)
        {
            ThrowParserException($"invalid format of G/# line. Found: {input}. Expected format: G/#rrrrccccccccctttttttttttttttttttttttttttttttttttttttt...");
        }

        if (!uint.TryParse(match.Groups[1].Value, out uint lineNum))
        {
            ThrowParserException($"invalid format of G/# line. Failed to parse line number {match.Groups[1].Value}");
        }
        if (!uint.TryParse(match.Groups[2].Value, out uint documentNumber))
        {
            ThrowParserException($"invalid format of G/# line. Failed to parse document number {match.Groups[2].Value}");
        }

        string[] descriptionParts = match.Groups[3].Value.Split(new char[] { '*', ';'}, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        string nonEvkPattern = $@"^([^-]+)-([^-]+)$";
        string evkPattern = $@"^EVK-([^-]+)-([^-]+)$";

        Dictionary<string, string> descriptions = new();
        Dictionary<string, string> evkDescriptions = new();

        foreach (string descriptionItem in descriptionParts)
        {
            Match nonEvkMatch = Regex.Match(descriptionItem, nonEvkPattern);
            if(nonEvkMatch.Success) 
            {
                descriptions.Add(nonEvkMatch.Groups[1].Value, nonEvkMatch.Groups[2].Value);
                continue;
            }
            Match evkMatch = Regex.Match(descriptionItem, evkPattern);
            if (evkMatch.Success)
            {
                evkDescriptions.Add(evkMatch.Groups[1].Value, evkMatch.Groups[2].Value);
                continue;
            }
            ThrowParserException($"invalid format of G/# line. Failed to parse description {descriptionItem}");
        }

        return new KxxDocumentDescription(
            DocumentLineNumber: lineNum,
            DocumentNumber: documentNumber,
            Descriptions: descriptions,
            EvkDescriptions: evkDescriptions);
    }

    [DoesNotReturn]
    private void ThrowParserException(string message)
    {
        throw new KxxParserException($"Line: {_lineCounter}: {message}");
    }
}
