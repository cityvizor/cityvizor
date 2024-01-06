using Cityvizor.Importer.Options;
using Microsoft.Extensions.Options;

namespace Cityvizor.Importer.BackgroungServices;

public class ImporterBackgroundService : BackgroundService
{
    private readonly BackgroundServicesOptions _options;
    private readonly ILogger<ImporterBackgroundService> _logger;
    private int _executionCount = 0; // TODO: delete

    public ImporterBackgroundService(IOptions<BackgroundServicesOptions> options, ILogger<ImporterBackgroundService> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation($"Background service run number {_executionCount}");
            _executionCount++;
            await Task.Delay(_options.ImporterServiceFrequency, stoppingToken);
        }
    }
}
