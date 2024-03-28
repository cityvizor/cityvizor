using Serilog;

namespace Cityvizor.Importer.Domain.Extensions;

public static class LoggingExtensions
{
    public const string ImportId = nameof(ImportId);
    public const string ImportLogFile = nameof(ImportLogFile);

    public static ILogger CreateImportLogger(this ILogger logger, int importId, string importLogFile)
    {
        return logger
            .ForContext(ImportId, importId)
            .ForContext(ImportLogFile, importLogFile);
    }
}
