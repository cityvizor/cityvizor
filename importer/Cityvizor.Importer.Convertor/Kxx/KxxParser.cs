using Cityvizor.Importer.Convertor.Kxx.Dtos;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;

[assembly: InternalsVisibleTo("Cityvizor.Importer.UnitTests")]

namespace Cityvizor.Importer.Convertor.Kxx;
internal class KxxParser
{
    ulong _lineCounter = 0;
    List<string> _errors = new();

    const int _headerLineMinimalLength = 20;

    /// <summary>
    /// Parses line 5/@ of .kxx file - header of the whole .kxx file
    /// 5/@xxxxxxxx00yy000cccc 
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    internal KxxHeader ParseKxxHeader(string input)
    {
        if (input.Length < _headerLineMinimalLength)
        {
            throw new KxxParserException($"Line:{_lineCounter}: .kxx file header {input} is too short. Length: {input.Length}. Expected at least {_headerLineMinimalLength} characters.");
        }

        const int licenceLen = 4;
        const int secondDelimiterLen = 3;
        const int monthLen = 2;
        const int firstDelimiterLen = 2;

        string pattern = $@"^5/@([0-9]{{8,10}})(0{{{firstDelimiterLen}}})([0-9]{{{monthLen}}})(0{{{secondDelimiterLen}}})([A-Z]{{{licenceLen}}})$";
        Match match = Regex.Match(input, pattern);
        if (!match.Success) 
        {
            throw new KxxParserException($"Line:{_lineCounter}: invalid format of 5/@ line. Found: {input}. Expected format: 5/@xxxxxxxx00yy000cccc");
        }
        string ico = match.Groups[1].Value;

        if (!byte.TryParse(match.Groups[3].Value, out byte month))
        {
            throw new KxxParserException($"Line: {_lineCounter}: invalid format of 5/@ line. Failed to parse month {match.Groups[1].Value}");
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
        throw new NotImplementedException();
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
