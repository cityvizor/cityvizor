using Cityvizor.Importer.Domain.Entities;
using Cityvizor.Importer.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Cityvizor.Importer.Infrastructure;

public class CityvizorDbContext(DbContextOptions<CityvizorDbContext> options) : DbContext(options)
{
    public DbSet<Import> Imports { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        Assembly assemblyWithConfigurations = GetType().Assembly;
        modelBuilder.ApplyConfigurationsFromAssembly(assemblyWithConfigurations);

        //modelBuilder.HasPostgresEnum<ImportStatus>();

        //Configure default schema
        //modelBuilder.HasDefaultSchema("app");
    }
}
