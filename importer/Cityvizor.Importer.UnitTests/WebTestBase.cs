using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace Cityvizor.Importer.UnitTests;
public class WebTestBase : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    internal WebApplicationFactory<Program> Factory => _factory;

    internal WebTestBase(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
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
