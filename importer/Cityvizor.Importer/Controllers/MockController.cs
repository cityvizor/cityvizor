using Cityvizor.Importer.Domain.Entities;
using Cityvizor.Importer.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace Cityvizor.Importer.Controllers;

[ApiController]
[Route("[controller]")]
public class MockController(ILogger<MockController> logger, CityvizorDbContext dbContex) : ControllerBase
{
    private readonly ILogger<MockController> _logger = logger;
    private readonly CityvizorDbContext _dbContex = dbContex;

    [HttpGet("Imports")]
    public Import[] GetImports()
    {
        var imports = _dbContex.Imports.ToArray();
        return [.. imports];
    }
}
