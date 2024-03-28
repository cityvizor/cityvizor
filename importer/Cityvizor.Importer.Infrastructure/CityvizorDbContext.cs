using Cityvizor.Importer.Domain.Entities;
using Microsoft.EntityFrameworkCore;
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

        // modelBuilder.NamesToSnakeCase();
        //Configure default schema
        //modelBuilder.HasDefaultSchema("app");
    }

}
