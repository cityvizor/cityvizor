using Cityvizor.Importer.Infrastructure;
using Cityvizor.Importer.Infrastructure.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Cityvizor.Importer.Controllers;
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{

    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;
    private readonly CityvizorDbContext _dbContex;

    public WeatherForecastController(ILogger<WeatherForecastController> logger, CityvizorDbContext dbContex)
    {
        _logger = logger;
        _dbContex = dbContex;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }

    [HttpGet("Imports")]
    public Import[] GetImports()
    {
        var imports = _dbContex.Imports.ToArray();
        return imports.ToArray();
    }
}
