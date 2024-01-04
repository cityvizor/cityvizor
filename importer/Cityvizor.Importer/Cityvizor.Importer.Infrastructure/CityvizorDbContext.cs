using Microsoft.EntityFrameworkCore;
using System;

namespace Cityvizor.Importer.Infrastructure;

public class CityvizorDbContext : DbContext
{
    public CityvizorDbContext(DbContextOptions<CityvizorDbContext> options) : base(options)
    {
    }
}
