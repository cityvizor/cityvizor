using Cityvizor.Importer.Converter.Kxx.Dtos;
using Cityvizor.Importer.Core.Dtos;
using Microsoft.Extensions.Logging;

namespace Cityvizor.Importer.Converter.Kxx;
internal class KxxRecordBuilder
{
    // some balances get filtered out based on Item number
    private const int _balanceItemFilterLowerBound = 1000; 
    private const int _balanceItemFilterUpperBound = 9000;

    // each kxx balance line contains both shouldGive and gave amounts, Item number decides how to compute overall amount for a kxx balance line
    private const int _balanceItemIncomeLowerBound = 5000;
    private const int _balanceItemIncomeUpperBound = 8000;

    private readonly ILogger<KxxRecordBuilder> _logger;

    public KxxRecordBuilder(ILogger<KxxRecordBuilder> logger)
    {
        this._logger = logger;
    }

    public AccountingAndPayments BuildRecordsFromDocuments(KxxDocument[] documents)
    {

    }

    private static bool IsRelevantBalance(DocumentBalance kxxDocumentBalance)
    {
        // other item numbers should be just technical and irrelevant for our purposes, bit I have no clue why
        // TODO: Sebek also manually filtered out some other Item numbers, add them here? 
        return kxxDocumentBalance.Item > _balanceItemFilterLowerBound && kxxDocumentBalance.Item < _balanceItemFilterUpperBound;
    }

    private static decimal ComputeAmount(DocumentBalance kxxDocumentBalance) 
    {
        // original javascript implementation return (Number(balance.pol) >= 5000 && Number(balance.pol) < 8000) ? balance.d - balance.md : balance.md - balance.d;
        return (kxxDocumentBalance.Item >= _balanceItemIncomeLowerBound && kxxDocumentBalance.Item < _balanceItemIncomeUpperBound)
          ? kxxDocumentBalance.Gave - kxxDocumentBalance.ShouldGive
          : kxxDocumentBalance.ShouldGive - kxxDocumentBalance.Gave;
    }
}
