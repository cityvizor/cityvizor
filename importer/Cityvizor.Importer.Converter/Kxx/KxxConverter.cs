using Cityvizor.Importer.Converter.Kxx.Dtos;
using Cityvizor.Importer.Domain.Dtos;
using Serilog;

namespace Cityvizor.Importer.Converter.Kxx;
public class KxxConverter
{
    public AccountingAndPayments ParseRecords(StreamReader inputStream, ILogger importScopedLogger)
    {
        KxxParser kxxParser = new KxxParser(inputStream, importScopedLogger);
        KxxDocument[] documents = kxxParser.Parse();
        KxxRecordBuilder recordBuilder = new KxxRecordBuilder(importScopedLogger);
        AccountingAndPayments records = recordBuilder.BuildRecordsFromDocuments(documents);
        return records;
    }
}
