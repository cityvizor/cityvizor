using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace Cityvizor.Importer.UnitTests;
public class WebTestBase : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    protected readonly ILogger _logger;

    internal WebApplicationFactory<Program> Factory => _factory;

    internal WebTestBase(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _logger = factory.Services.GetRequiredService<ILogger>();
    }

    public TService GetRequiredService<TService>() where TService : notnull
    {
        return Factory.Services.GetRequiredService<TService>();
    }

    public TService? GetService<TService>()
    {
        return Factory.Services.GetService<TService>();
    }
}
