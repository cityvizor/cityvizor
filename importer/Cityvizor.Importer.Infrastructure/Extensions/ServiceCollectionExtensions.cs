using Cityvizor.Importer.Domain.Abstractions.Repositories;
using Cityvizor.Importer.Domain.Enums;
using Cityvizor.Importer.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Npgsql;

namespace Cityvizor.Importer.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection RegisterRepositoriesScoped(this IServiceCollection services)
    {
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        return services;
    }

    public static IServiceCollection AddCityvizorDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        var dataSourceBuilder = new NpgsqlDataSourceBuilder(configuration.GetConnectionString("PosgreSql"));
        dataSourceBuilder.MapEnum<ImportStatus>();

        var dataSource = dataSourceBuilder.Build();
        services.AddDbContext<CityvizorDbContext>(options => options
            .UseNpgsql(dataSource, o => o.MapEnum<ImportStatus>("import_status"))
            .UseSnakeCaseNamingConvention());

        return services;
    }
}
