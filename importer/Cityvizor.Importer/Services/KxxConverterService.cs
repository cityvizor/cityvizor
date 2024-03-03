using Cityvizor.Importer.Converter.Kxx;
using Cityvizor.Importer.Converter.Kxx.Abstractions;

namespace Cityvizor.Importer.Services;

public class KxxParserFactoryService : IKxxParserFactoryService
{
    private readonly ILoggerFactory _loggerFactory;

    public KxxParserFactoryService(ILoggerFactory loggerFactory)
    {
        this._loggerFactory = loggerFactory;
    }

    public KxxParser CreateParser(StreamReader stream)
    {
        return new KxxParser(stream, _loggerFactory.CreateLogger<KxxParser>());
    }
}
