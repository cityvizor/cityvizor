using Cityvizor.Importer.Domain.Entities;
using Cityvizor.Importer.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cityvizor.Importer.Infrastructure.EntityConfigurations;
internal class ImportEntityConfiguration : IEntityTypeConfiguration<Import>
{
    public void Configure(EntityTypeBuilder<Import> builder)
    {
        builder.ToTable("imports", schema: "app");

        builder.HasKey(x => x.Id);

        //builder.Property(i => i.Status)
        //    .HasConversion(
        //        v => v.ToString(),
        //        v =>Enum.Parse<ImportStatus>(v, true));

        builder.Property(i => i.Format)
            .HasConversion(
                v => v.ToString(),
                v => Enum.Parse<ImportFormat>(v, true));

        builder.Property(i => i.ImportDir)
            .HasMaxLength(255);
    }
}
