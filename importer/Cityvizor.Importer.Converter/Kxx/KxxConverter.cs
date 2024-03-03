using Cityvizor.Importer.Converter.Kxx.Abstractions;
using Cityvizor.Importer.Converter.Kxx.Dtos;
using Cityvizor.Importer.Core.Dtos;

namespace Cityvizor.Importer.Converter.Kxx;
public class KxxConverter
{
    private readonly IKxxParserFactoryService _kxxConverterService;
    private readonly KxxRecordBuilder _kxxRecordBuilder;

    public KxxConverter(IKxxParserFactoryService kxxConverterService, KxxRecordBuilder kxxRecordBuilder)
    {
        _kxxConverterService = kxxConverterService;
        _kxxRecordBuilder = kxxRecordBuilder;
    }

    public AccountingAndPayments ParseRecords(StreamReader inputStream)
    {
        KxxParser kxxParser = _kxxConverterService.CreateParser(inputStream);
        KxxDocument[] documents = kxxParser.Parse();
        AccountingAndPayments records = _kxxRecordBuilder.BuildRecordsFromDocuments(documents);
        return records;
    }
}
