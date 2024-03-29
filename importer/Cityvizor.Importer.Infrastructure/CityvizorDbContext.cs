using Cityvizor.Importer.Domain.Entities;
using Cityvizor.Importer.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using System.Reflection;

namespace Cityvizor.Importer.Infrastructure;

public class CityvizorDbContext : DbContext
{
    public DbSet<Import> Imports { get; set; }

    public CityvizorDbContext(DbContextOptions<CityvizorDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        Assembly assemblyWithConfigurations = GetType().Assembly;
        modelBuilder.ApplyConfigurationsFromAssembly(assemblyWithConfigurations);

        modelBuilder.HasPostgresEnum<ImportStatus>();

        //Configure default schema
        //modelBuilder.HasDefaultSchema("app");
    }

}
