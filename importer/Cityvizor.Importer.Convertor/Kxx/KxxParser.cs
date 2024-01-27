using Cityvizor.Importer.Convertor.Kxx.Dtos;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("Cityvizor.Importer.UnitTests")]

namespace Cityvizor.Importer.Convertor.Kxx;
internal class KxxParser
{
    /// <summary>
    /// Parses line 5/@ of .kxx file - header of the whole .kxx file
    /// 5/@xxxxxxxx00yy000cccc 
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    internal KxxHeader ParseKxxHeader(string input)
    {
        throw new NotImplementedException();
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
