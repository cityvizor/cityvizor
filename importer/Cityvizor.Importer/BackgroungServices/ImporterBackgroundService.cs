using Cityvizor.Importer.Options;
using Cityvizor.Importer.Writer.Services;
using Microsoft.Extensions.Options;
using System.Diagnostics.CodeAnalysis;
using Serilog;

namespace Cityvizor.Importer.BackgroungServices;

public class ImporterBackgroundService : BackgroundService
{
    private readonly BackgroundServicesOptions _options;
    private readonly Serilog.ILogger _logger;
    private readonly IServiceScopeFactory _scopeFactory;
    private int _executionCount = 0; // TODO: delete

    public ImporterBackgroundService(IOptions<BackgroundServicesOptions> options, Serilog.ILogger logger, IServiceScopeFactory scopeFactory)
    {
        _options = options.Value;
        _logger = logger;
        _scopeFactory = scopeFactory;
        _logger.Information($"Starting ImporterBagroundService. Runs every {_options.ImporterServiceFrequency} milliseconds");
    }

    [SuppressMessage("Design", "CA1031:Do not catch general exception types", Justification = "We catch anything and alert instead of rethrowing")]
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Awaiting Task.Yield() transitions to asynchronous operation immediately.
        // This allows startup to continue without waiting.
        // https://mjconrad.com/blog/dotnet6-managing-exceptions-in-backgroundservice-or-ihostedservice-workers
        await Task.Yield();

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    JobManagerService jobManagerService = scope.ServiceProvider.GetRequiredService<JobManagerService>();
                    _logger.Information($"Background service run number {_executionCount}");
                    _executionCount++;
                    await jobManagerService.RunJobsIfAny();
                }
            }
            catch (Exception ex) 
            {
                _logger.Error(
                       ex, "Unhandled exception occurred Importer background service worker. Worker will retry after the normal interval.");
            }
            await Task.Delay(_options.ImporterServiceFrequency, stoppingToken);
        }
    }
}
