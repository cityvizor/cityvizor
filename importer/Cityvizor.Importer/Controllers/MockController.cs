using Cityvizor.Importer.Domain.Entities;
using Cityvizor.Importer.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace Cityvizor.Importer.Controllers;
[ApiController]
[Route("[controller]")]
public class MockController : ControllerBase
{
    private readonly ILogger<MockController> _logger;
    private readonly CityvizorDbContext _dbContex;

    public MockController(ILogger<MockController> logger, CityvizorDbContext dbContex)
    {
        _logger = logger;
        _dbContex = dbContex;
    }

    [HttpGet("Imports")]
    public Import[] GetImports()
    {
        var imports = _dbContex.Imports.ToArray();
        return imports.ToArray();
    }
}
