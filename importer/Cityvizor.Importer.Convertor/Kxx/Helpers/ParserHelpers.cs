using Cityvizor.Importer.Convertor.Kxx.Enums;
using System.Diagnostics.CodeAnalysis;

namespace Cityvizor.Importer.Convertor.Kxx.Helpers;
internal static class ParserHelpers
{
    internal static bool TryParseInputIndetifier(string identifierString, [NotNullWhen(true)] out InputIndetifier? inputIndetifier)
    {
        if (!int.TryParse(identifierString, out var identifierNum))
        {
            inputIndetifier = null;
            return false;
        }
        if (identifierNum == 0) // both 0 and 1 mean Add
        {
            inputIndetifier = InputIndetifier.Add;
            return true;

        }
        if (!Enum.TryParse(identifierString, out InputIndetifier idf))
        {
            inputIndetifier = null;
            return false;
        }
        inputIndetifier = idf;
        return true;
    }
}
