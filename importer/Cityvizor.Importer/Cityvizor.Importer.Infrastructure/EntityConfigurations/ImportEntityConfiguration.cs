using Cityvizor.Importer.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cityvizor.Importer.Infrastructure.EntityConfigurations;
internal class ImportEntityConfiguration : IEntityTypeConfiguration<Import>
{
    public void Configure(EntityTypeBuilder<Import> builder)
    {
        

        builder.HasKey(x => x.Id);

        builder.Property(i => i.Status)
            .HasConversion<string>();
    }
}
