using Cityvizor.Importer.Domain.Abstractions.Repositories;
using Cityvizor.Importer.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace Cityvizor.Importer.Infrastructure.Extensions;
public static class ServiceCollectionExtensions
{
    public static IServiceCollection RegisterRepositoriesTransient(this IServiceCollection services)
    {
        services.AddTransient(typeof(IRepository<>), typeof(Repository<>));
        return services;
    }
}
