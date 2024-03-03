using Cityvizor.Importer.Converter.Kxx;
using Cityvizor.Importer.Converter.Kxx.Abstractions;

namespace Cityvizor.Importer.Services;

public class KxxConverterService : IKxxConverterService
{
    private readonly ILoggerFactory _loggerFactory;

    public KxxConverterService(ILoggerFactory loggerFactory)
    {
        this._loggerFactory = loggerFactory;
    }

    public KxxParser CreateParser(StreamReader stream)
    {
        return new KxxParser(stream, _loggerFactory.CreateLogger<KxxParser>());
    }

    public KxxRecordBuilder CreateRecordBuilder() 
    {
        return new KxxRecordBuilder(_loggerFactory.CreateLogger<KxxRecordBuilder>());
    }
}
