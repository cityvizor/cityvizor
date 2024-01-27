using Cityvizor.Importer.Convertor.Kxx.Dtos;
using Cityvizor.Importer.Convertor.Kxx.Enums;
using Cityvizor.Importer.Convertor.Kxx.Helpers;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;

[assembly: InternalsVisibleTo("Cityvizor.Importer.UnitTests")]

namespace Cityvizor.Importer.Convertor.Kxx;
internal class KxxParser
{
    ulong _lineCounter = 0;
    List<string> _errors = new();

    string? _fileIco = null;
    uint? _fileAccountingYear = null;

    const int _headerLineMinimalLength = 20;
    const int _documentBlockHeaderMinimalLength = 22;

    [DoesNotReturn]
    private void ThrowParserException(string message)
    {
        throw new KxxParserException($"Line: {_lineCounter}: {message}");
    }

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
        throw new NotImplementedException();
    }
}
