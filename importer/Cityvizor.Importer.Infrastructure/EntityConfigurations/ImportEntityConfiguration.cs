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

        // status enum is enum even in posgress and needs to be handled in a special way in dbContext OnModelCreating and when registering db context 

        // manual snake_case conversion
        builder.Property(i => i.Format)
            .HasConversion(
                enumValue => ImportFormatToStringConversion(enumValue),
                stringValue => StringToImportFormatConversion(stringValue));

        builder.Property(i => i.ImportDir)
            .HasMaxLength(255);
    }

    private static string ImportFormatToStringConversion(ImportFormat importFormat)
    {
#pragma warning disable CS8524 // The switch expression does not handle some values of its input type (it is not exhaustive) involving an unnamed enum value.
        return importFormat switch
        {
            ImportFormat.Cityvizor => "cityvizor",
            ImportFormat.InternetStream => "internetstream",
            ImportFormat.Ginis => "ginis",
            ImportFormat.PboExpectedPlan => "pbo_expected_plan",
            ImportFormat.PboRealPlan => "pbo_real_plan",
            ImportFormat.PboAaNames => "pbo_aa_names"
        };
#pragma warning restore CS8524 // The switch expression does not handle some values of its input type (it is not exhaustive) involving an unnamed enum value.
    }

    private static ImportFormat StringToImportFormatConversion(string importFormatString)
    {
        return importFormatString switch
        {
            "cityvizor" => ImportFormat.Cityvizor,
            "internetstream" => ImportFormat.InternetStream,
            "ginis" => ImportFormat.Ginis,
            "pbo_expected_plan" => ImportFormat.PboExpectedPlan,
            "pbo_real_plan" => ImportFormat.PboRealPlan,
            "pbo_aa_names" => ImportFormat.PboAaNames,
            _ => throw new ArgumentException($"Failed to convert string {importFormatString} to ImportFormat enum.")
        };
    }
}
