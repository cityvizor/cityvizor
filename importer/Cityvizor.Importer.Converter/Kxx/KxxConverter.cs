using Cityvizor.Importer.Converter.Kxx.Dtos;
using Cityvizor.Importer.Domain.Dtos;
using Serilog;

namespace Cityvizor.Importer.Converter.Kxx;

public class KxxConverter
{
    public static AccountingAndPayments ParseRecords(StreamReader inputStream, ILogger importScopedLogger)
    {
        KxxParser kxxParser = new(inputStream, importScopedLogger);
        KxxDocument[] documents = kxxParser.Parse();
        KxxRecordBuilder recordBuilder = new(importScopedLogger);
        AccountingAndPayments records = recordBuilder.BuildRecordsFromDocuments(documents);
        return records;
    }
}
