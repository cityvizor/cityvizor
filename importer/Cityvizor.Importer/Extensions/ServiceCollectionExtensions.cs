using Cityvizor.Importer.BackgroungServices;
using Cityvizor.Importer.Options;
using Cityvizor.Importer.Validators;
using Microsoft.Extensions.Options;

namespace Cityvizor.Importer.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection RegisterImporterBackgroundService(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<IValidateOptions<BackgroundServicesOptions>, BackgroundServicesOptionsValidator>();
        services
            .AddOptions<BackgroundServicesOptions>()
            .Bind(configuration.GetSection("BackgroundServices"))
            .ValidateOnStart();
        return services.AddHostedService<ImporterBackgroundService>();
    }
}
