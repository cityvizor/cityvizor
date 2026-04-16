using Cityvizor.Importer.BackgroundServices;
using Cityvizor.Importer.Converter.Kxx;
using Cityvizor.Importer.Options;
using Cityvizor.Importer.Validators;
using Microsoft.Extensions.Options;

namespace Cityvizor.Importer.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection RegisterImporterBackgroundService(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<IValidateOptions<ImporterServiceOptions>, ImporterServiceOptionsValidator>();
        services
            .AddOptions<ImporterServiceOptions>()
            .Bind(configuration.GetSection("ImporterService"))
            .ValidateOnStart();
        return services.AddHostedService<ImporterBackgroundService>();
    }

    public static IServiceCollection RegisterKxxConverter(this IServiceCollection services)
    {
        services.AddTransient<KxxConverter>();
        return services;
    }
}
