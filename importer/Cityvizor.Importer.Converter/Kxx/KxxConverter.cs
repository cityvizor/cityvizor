using Cityvizor.Importer.Converter.Kxx.Abstractions;
using Cityvizor.Importer.Converter.Kxx.Dtos;
using Cityvizor.Importer.Core.Dtos;

namespace Cityvizor.Importer.Converter.Kxx;
public class KxxConverter
{
    private readonly IKxxConverterService _kxxConverterService;

    public KxxConverter(IKxxConverterService kxxConverterService)
    {
        _kxxConverterService = kxxConverterService;
    }

    public AccountingAndPayments ParseRecords(StreamReader inputStream)
    {
        KxxParser kxxParser = _kxxConverterService.CreateParser(inputStream);
        KxxDocument[] documents = kxxParser.Parse();
        KxxRecordBuilder kxxRecordBuilder = _kxxConverterService.CreateRecordBuilder();
        AccountingAndPayments records = kxxRecordBuilder.BuildRecordsFromDocuments(documents);
        return records;
    }
}
