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

    internal static bool TryParseAmount(string amountString, string signString, [NotNullWhen(true)] out decimal? amount)
    {
        if(!decimal.TryParse(amountString, out decimal parsedAmount))
        {
            amount = null;
            return false;
        }
        int sign = ParseSign(signString[0]);
        parsedAmount /= 100; // fixed position of decimal dot on the second position
        amount = parsedAmount * sign;
        return true;
    }

    internal static int ParseSign(char signChar)
    {
        return signChar switch
        {
            ' ' => 1,
            '-' => -1,
            'c' => -1,
            'C' => -1,
            _ => throw new InvalidOperationException($"Unexpected sign string {signChar}")
        };
    }
}
