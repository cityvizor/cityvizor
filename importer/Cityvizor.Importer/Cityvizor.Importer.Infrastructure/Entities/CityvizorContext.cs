using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Cityvizor.Importer.Infrastructure.Entities;

public partial class CityvizorContext : DbContext
{
    public CityvizorContext()
    {
    }

    public CityvizorContext(DbContextOptions<CityvizorContext> options)
        : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Database=cityvizor;Username=postgres;Password=pass");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresEnum("import_status", new[] { "pending", "processing", "success", "error" });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
