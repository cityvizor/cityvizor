using Cityvizor.Importer.Convertor.Kxx;

namespace Cityvizor.Importer.Services;

public class KxxParserService
{
    private readonly ILoggerFactory _loggerFactory;

    public KxxParserService(ILoggerFactory loggerFactory)
    {
        this._loggerFactory = loggerFactory;
    }

    public KxxParser CreateParser(StreamReader stream)
    {
        return new KxxParser(stream, _loggerFactory.CreateLogger<KxxParser>());
    }
}
