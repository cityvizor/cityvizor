using Cityvizor.Importer.Converter.Kxx.Dtos.Enums;
using Cityvizor.Importer.Converter.Kxx.Dtos;
using Cityvizor.Importer.Converter.Kxx.Helpers;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using Cityvizor.Importer.Converter.Kxx.Enums;
using Serilog;

namespace Cityvizor.Importer.Converter.Kxx;

internal class KxxParser(StreamReader stream, ILogger logger)
{
    private const int _headerLineMinimalLength = 20;
    private const int _documentBlockHeaderMinimalLength = 22;
    private const int _documentNumberLen = 9;

    private readonly StreamReader _stream = stream;
    private readonly ILogger _logger = logger;

    // parsing state
    private ulong _lineCounter = 1;
    private bool _parsingFinished = false;

    private KxxFileHeader _fileHeader;
    private uint? _fileAccountingYear = null;

    private KxxSectionHeader? _currentSectionHeader = null;
    private readonly Dictionary<uint, KxxDocument> _currentSectionDocuments = [];

    private readonly List<KxxDocument> _finishedDocuments = [];

    public KxxDocument[] Parse() // TODO: return stream
    {
        if (_parsingFinished)
        {
            throw new KxxParserException("This instance of parser already finished parsing its stream. Cannot use the same KxxParser instance multiple times.");
        }

        string headerLine = _stream.ReadLine() ?? throw new KxxParserException("Trying to parse empty .kxx file.");
        _fileHeader = ParseKxxFileHeader(headerLine);

        string? line = _stream.ReadLine();
        _lineCounter++;
        while (line is not null)
        {
            if (!ParserHelpers.TryDetermineLineType(line, out KxxLineType? lineType))
            {
                ThrowParserException($"Unexpected type of line {line}.");
            }
            switch (lineType)
            {
                case KxxLineType.SectionHeader:
                    ProcessSectionHeader(line);
                    break;
                case KxxLineType.DocumentBalance:
                    ProcessDocumentBalance(line);
                    break;
                case KxxLineType.DocumentDescription:
                    ProcessDocumentDescription(line);
                    break;
                case KxxLineType.DocumentBalanceDescription:
                    ProcessDocumentLineDescription(line);
                    break;
                case KxxLineType.FileHeader:
                    ThrowParserException($"Unexpected type of line {line}.");
                    break; // unreachable
                case null:
                    ThrowParserException($"Unexpected type of line {line}.");
                    break;
            }

            line = _stream.ReadLine();
            _lineCounter++;
        }

        FlushSectionDocuments();
        _parsingFinished = true;
        return [.. _finishedDocuments];
    }

    internal void ProcessDocumentDescription(string line)
    {
        if (_currentSectionHeader is null)
        {
            ThrowParserException($"Document description (G/# line) found outside of document block (starting with 6/@ line): {line}");
        }

        KxxDocumentDescription documentDescription = ParseKxxDocumentDescription(line);
        if (!_currentSectionDocuments.TryGetValue(documentDescription.DocumentId, out KxxDocument? document))
        {
            ThrowParserException($"Found document description with document id {documentDescription.DocumentId} that does not correspond to any document in given section.");
        }

        foreach ((string key, string value) in documentDescription.Descriptions)
        {
            if (!document.Descriptions.TryAdd(key, value))
            {
                ThrowParserException($"Found duplicate key in document description. Key: {key}. Line {line}");
            }
        }
        foreach ((string key, string value) in documentDescription.EvkDescriptions)
        {
            if (!document.EvkDescriptions.TryAdd(key, value))
            {
                ThrowParserException($"Found duplicate key in document description. Key: {key}. Line {line}");
            }
        }
        document.PlainTextDescriptions.AddRange(documentDescription.PlainTextDescription);
    }

    internal void ProcessDocumentLineDescription(string line)
    {
        if (_currentSectionHeader is null)
        {
            ThrowParserException($"Document balance line description (G/$ line) found outside of document block (starting with 6/@ line): {line}");
        }

        KxxDocumentBalanceDescription balanceDescription = ParseKxxDocumentBalanceDescription(line);
        if (!_currentSectionDocuments.TryGetValue(balanceDescription.DocumentId, out KxxDocument? document))
        {
            ThrowParserException($"Found balance description with document id {balanceDescription.DocumentId} that does not correspond to any document in given section.");
        }

        ValidateDocumentBalanceDesription(balanceDescription, line);

        // we add description to the last balance in the given document we encountered, because .kxx specification say 
        // that description should directly follow the balance it is related to 
        // and we don't understand the meaning of line numbers on G/$ lines as we have only seen .kkx files where line number is equal to one
        // but we have seen G/# lines with larger line number then the number of balance lines in related document
        document.Balances.Last().Descriptions.Add(balanceDescription.BalanceDescription);
    }

    internal void ValidateDocumentBalanceDesription(KxxDocumentBalanceDescription lineDescription, string line)
    {
        if (lineDescription.DocumentLineNumber != 1)
        {
            LogWarning($"Document balance line description (G/$ line) with document line number different from 1 found: {lineDescription.DocumentId}, line: {line}");
        }
    }

    internal void ProcessDocumentBalance(string line)
    {
        if (!_currentSectionHeader.HasValue)
        {
            ThrowParserException($"Document balance line (G/@ line) found outside of document block (starting with 6/@ line): {line}");
        }

        KxxDocumentBalance documentBalance = ParseKxxDocumentBalance(line);
        ValidateDocumentBalance(documentBalance, line);

        KxxDocument balanceDocument = GetOrCreateDocument(documentBalance);

        DocumentBalance balance = new(documentBalance, _currentSectionHeader.Value.AccountingYear, _currentSectionHeader.Value.AccountingMonth);
        balanceDocument.Balances.Add(balance);
    }

    internal void ValidateDocumentBalance(KxxDocumentBalance kxxDocumentBalance, string line)
    {
        if (kxxDocumentBalance.Gave != 0 && kxxDocumentBalance.ShouldGive != 0)
        {
            LogError($"Found document balance with both ShouldGive and Gave non-zero. Line {line}");
        }
    }

    /// <summary>
    /// Returns document with given documentId, if such does not exists in current section, creates it and adds it to the section
    /// </summary>
    /// <param name="documentBalance"></param>
    /// <returns></returns>
    private KxxDocument GetOrCreateDocument(KxxDocumentBalance documentBalance)
    {
        if (_currentSectionDocuments.TryGetValue(documentBalance.DocumentId, out KxxDocument? document))
        {
            return document;
        }
        KxxDocument newDocument = new(_currentSectionHeader!.Value, documentBalance.DocumentId);
        _currentSectionDocuments.Add(newDocument.DocumentId, newDocument);
        return newDocument;
    }

    internal void ProcessSectionHeader(string line)
    {
        KxxSectionHeader sectionHeader = ParseKxxSectionHeader(line);
        if (!_fileAccountingYear.HasValue)
        {
            _fileAccountingYear = sectionHeader.AccountingYear;
        }
        ValidateSectionHeader(sectionHeader);
        OpenNewSection(sectionHeader);
    }

    private void ValidateSectionHeader(KxxSectionHeader sectionHeader)
    {
        if (!sectionHeader.Ico.Equals(_fileHeader.Ico, StringComparison.OrdinalIgnoreCase))
        {
            LogError($"Kxx section header contains Ico {sectionHeader.Ico} that does not match Ico {_fileHeader.Ico} in .kxx file header.");
        }
        if (sectionHeader.AccountingYear != _fileAccountingYear)
        {
            LogError($"Kxx section header contains year {sectionHeader.AccountingYear} that does not match previous year {_fileAccountingYear} in .kxx file.");
        }
    }

    /// <summary>
    /// Parses line 5/@ of .kxx file - header of the whole .kxx file
    /// 5/@xxxxxxxx00yy000cccc 
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    internal KxxFileHeader ParseKxxFileHeader(string input)
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

        if (!ushort.TryParse(match.Groups[3].Value, out ushort month))
        {
            ThrowParserException($" invalid format of 5/@ line. Failed to parse month {match.Groups[3].Value}");
        }

        string licence = match.Groups[5].Value;

        return new KxxFileHeader(Ico: ico, AccountingMonth: month, ProgramLicence: licence);
    }

    /// <summary>
    /// Represents line 6/@ of .kxx file - header of a block representing one section
    /// 6/@xxxxxxxxyyzz_t_rrrr 
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    internal KxxSectionHeader ParseKxxSectionHeader(string input)
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
        if (!match.Success)
        {
            ThrowParserException($"invalid format of 6/@ line. Found: {input}. Expected format: 6/@xxxxxxxxyyzz_t_rrrr ");
        }

        string ico = match.Groups[1].Value;
        if (!ushort.TryParse(match.Groups[2].Value, out ushort month))
        {
            ThrowParserException($"invalid format of 6/@ line. Failed to parse month {match.Groups[2].Value}");
        }

        if (!Enum.TryParse(match.Groups[3].Value, out DocumentType documentType))
        {
            ThrowParserException($"invalid format of 6/@ line. Failed to parse document type {match.Groups[3].Value}");
        }

        if (!ParserHelpers.TryParseInputIndetifier(match.Groups[4].Value, out InputIdentifier? inputIndetifier))
        {
            ThrowParserException($"invalid format of 6/@ line. Failed to parse input identifier {match.Groups[4].Value}");
        }

        if (!ushort.TryParse(match.Groups[5].Value, out ushort accoutingYear))
        {
            ThrowParserException($"invalid format of 6/@ line. Failed to parse accounting year {match.Groups[5].Value}");
        }

        return new KxxSectionHeader(Ico: ico, AccountingMonth: month, DocumentType: documentType, InputIndetifier: inputIndetifier.Value, AccountingYear: accoutingYear);
    }

    /// <summary>
    /// Parses G/@ line of .kxx file - one balance in document (invoice)
    /// G/@ddccccccccc000sssaaaakkoooooollllzzzuuuuuuuuujjjjjjjjjjgggggggggggggmmmmmmmmmmmmmmmmmm_dddddddddddddddddd_
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    internal KxxDocumentBalance ParseKxxDocumentBalance(string input)
    {
        const int dayLen = 2;
        const int delimiterLen = 3;
        const int syntheticLen = 3;
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

        string pattern = $@"^G/@([0-9]{{{dayLen}}})(.{{{_documentNumberLen}}})(0{{{delimiterLen}}})([0-9]{{{syntheticLen}}})([0-9]{{{analyticLen}}})([0-9]{{{chapterLen}}})([0-9]{{{paragraphLen}}})([0-9]{{{itemLen}}})([0-9]{{{recordUnitLen}}})([0-9]{{{purposeMarkLen}}})([0-9]{{{oraganizationUnitLen}}})([0-9]{{{organizationLen}}})([0-9]{{{shouldGiveLen}}})([ cC-]{{1}})([0-9]{{{gaveLen}}})([ cC-]{{1}})$";
        Match match = Regex.Match(input, pattern);

        if (!match.Success)
        {
            ThrowParserException($"invalid format of G/@ line. Found: {input}. Expected format: G/@ddccccccccc000sssaaaakkoooooollllzzzuuuuuuuuujjjjjjjjjjgggggggggggggmmmmmmmmmmmmmmmmmm_dddddddddddddddddd_");
        }
        if (!ushort.TryParse(match.Groups[1].Value, out ushort accountedDay))
        {
            ThrowParserException($"invalid format of G/@ line. Failed to parse accounted day {match.Groups[1].Value}");
        }
        if (!uint.TryParse(match.Groups[2].Value, out uint documentNumber))
        {
            ThrowParserException($"invalid format of G/@ line. Failed to parse document number {match.Groups[2].Value}");
        }
        // 000 delimiter
        if (!uint.TryParse(match.Groups[4].Value, out uint syntheticAccount))
        {
            ThrowParserException($"invalid format of G/@ line. Failed to parse synthetic account {match.Groups[4].Value}");
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
        return new KxxDocumentBalance(
            AccountedDay: accountedDay,
            DocumentId: documentNumber,
            SyntheticAccount: syntheticAccount,
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
    ///  Represents G/$ line in .kxx file - document balance description
    /// G/$rrrrccccccccctttttttttttttttttttttttttttttttttttttttt...
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    internal KxxDocumentBalanceDescription ParseKxxDocumentBalanceDescription(string input)
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

        return new KxxDocumentBalanceDescription(
            DocumentLineNumber: lineNum,
            DocumentId: documentNumber,
            BalanceDescription: description);
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

        string descriptionsString = match.Groups[3].Value;
        if (!descriptionsString.StartsWith('*'))
        {
            // LogWarning($"Document description in non-dictionary format: {input}");
            return new KxxDocumentDescription(
               DocumentLineNumber: lineNum,
               DocumentId: documentNumber,
               Descriptions: [],
               EvkDescriptions: [],
               PlainTextDescription: [descriptionsString]);
        }

        var descriptionParts = match.Groups[3].Value
            .Split(";*", StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(s => s.Trim([';', '*']));
        string nonEvkPattern = $@"^([^-]+)-(.+)$"; // disallow - in the key, allow it in the value
        string evkPattern = $@"^EVK-([^-]+)-(.+)$";

        Dictionary<string, string> descriptions = [];
        Dictionary<string, string> evkDescriptions = [];

        foreach (string descriptionItem in descriptionParts)
        {
            Match evkMatch = Regex.Match(descriptionItem, evkPattern);
            if (evkMatch.Success)
            {
                evkDescriptions.Add(evkMatch.Groups[1].Value, evkMatch.Groups[2].Value);
                continue;
            }
            Match nonEvkMatch = Regex.Match(descriptionItem, nonEvkPattern);
            if (nonEvkMatch.Success)
            {
                descriptions.Add(nonEvkMatch.Groups[1].Value, nonEvkMatch.Groups[2].Value);
                continue;
            }
            ThrowParserException($"invalid format of G/# line. Failed to parse description {descriptionItem}");
        }

        return new KxxDocumentDescription(
            DocumentLineNumber: lineNum,
            DocumentId: documentNumber,
            Descriptions: descriptions,
            EvkDescriptions: evkDescriptions,
            PlainTextDescription: []);
    }

    private void FlushSectionDocuments()
    {
        _finishedDocuments.AddRange(_currentSectionDocuments.Values);
        _currentSectionDocuments.Clear();
    }

    private void OpenNewSection(KxxSectionHeader newSectionHeader)
    {
        // flush documents of section that is being closed to the list of finished documents
        FlushSectionDocuments();
        _currentSectionHeader = newSectionHeader;
    }

    [DoesNotReturn]
    private void ThrowParserException(string message)
    {
        throw new KxxParserException($"Line: {_lineCounter}: {message}");
    }

    private void LogError(string message)
    {
        _logger.Error("Line: {LineCounter}: {Message}", _lineCounter, message);
    }

    private void LogWarning(string message)
    {
        _logger.Warning("Line: {LineCounter}: {Message}", _lineCounter, message);
    }
}
