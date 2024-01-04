using Cityvizor.Importer.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using System;

namespace Cityvizor.Importer.Infrastructure;

public class CityvizorDbContext : DbContext
{
    public DbSet<Import> Imports { get; set; }

    public CityvizorDbContext(DbContextOptions<CityvizorDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Import>().ToTable("Imports", schema: "app");
        //Configure default schema
        //modelBuilder.HasDefaultSchema("app");
    }
}
