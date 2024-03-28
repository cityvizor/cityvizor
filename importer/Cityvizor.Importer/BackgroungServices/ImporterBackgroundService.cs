using Cityvizor.Importer.Options;
using Cityvizor.Importer.Writer.Services;
using Microsoft.Extensions.Options;
using System.Diagnostics.CodeAnalysis;

namespace Cityvizor.Importer.BackgroungServices;

public class ImporterBackgroundService : BackgroundService
{
    private readonly BackgroundServicesOptions _options;
    private readonly ILogger<ImporterBackgroundService> _logger;
    private readonly JobManagerService _jobManagerService;
    private int _executionCount = 0; // TODO: delete

    public ImporterBackgroundService(IOptions<BackgroundServicesOptions> options, ILogger<ImporterBackgroundService> logger, JobManagerService jobManagerService)
    {
        _options = options.Value;
        _logger = logger;
        _jobManagerService = jobManagerService;
        _logger.LogInformation($"Starting ImporterBagroundService. Runs every {_options.ImporterServiceFrequency} milliseconds");
    }

    [SuppressMessage("Design", "CA1031:Do not catch general exception types", Justification = "We catch anything and alert instead of rethrowing")]
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Awaiting Task.Yield() transitions to asyncronous operation immediatly.
        // This allows startup to continue without waiting.
        // https://mjconrad.com/blog/dotnet6-managing-exceptions-in-backgroundservice-or-ihostedservice-workers
        await Task.Yield();

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                _logger.LogInformation($"Background service run number {_executionCount}");
                _executionCount++;
                await _jobManagerService.RunJobsIfAny();
            }
            catch (Exception ex) 
            {
                _logger.LogError(
                       ex, "Unhandled exception occurred Importer background service worker. Worker will retry after the normal interval.");
            }
            await Task.Delay(_options.ImporterServiceFrequency, stoppingToken);
        }
    }
}
