using Cityvizor.Importer.Infrastructure.Entities;
using Cityvizor.Importer.Infrastructure.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Reflection.Emit;

namespace Cityvizor.Importer.Infrastructure.EntityConfigurations;
internal class ImportEntityConfiguration : IEntityTypeConfiguration<Import>
{
    public void Configure(EntityTypeBuilder<Import> builder)
    {
        builder.ToTable("imports", schema: "app");

        builder.HasKey(x => x.Id);

        builder.Property(i => i.Status)
            .HasConversion(
                v => v.ToString(),
                v =>Enum.Parse<ImportStatus>(v, true));
    }
}
