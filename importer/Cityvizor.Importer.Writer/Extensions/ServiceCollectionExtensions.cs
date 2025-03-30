using Cityvizor.Importer.Writer.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Cityvizor.Importer.Writer.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection RegisterImportServices(this IServiceCollection services)
    {
        services.AddTransient<GinisConversionService>();
        services.AddTransient<JobManagerService>();
        services.AddTransient<FileSystemService>();
        return services;
    }
}
