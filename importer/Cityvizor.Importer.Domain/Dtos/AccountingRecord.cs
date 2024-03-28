namespace Cityvizor.Importer.Domain.Dtos;
namespace Cityvizor.Importer.Domain;

public record AccountingRecord(
    AccountingRecordType Type,
    uint Paragraph,
    uint Item,
    ulong Event, // organization
    ulong RecordUnit, // organizationUnit
    decimal Amount
);

// TODO: beware - original demo implementation was only producing AccountingRecords of 2 types - POK and ROZ
// as summing together ApprovedBudget and EditedBudget is one of the possible causes of Brno-Medlanky issues
// I've decided to split approved and edited budgets to separate records so that we can potentially deal with them separately
// this may require changes in Cityvizor logic
public enum AccountingRecordType
{
    Pok, // Pokladna - AccountingRecord created from balance belonging to document of type OrdinaryMonth (0)
    Roz, // Rozpocet - for backwards compatibility, is likely to equal to sum of Approved and Edited
    RozSch, // Rozpocet schvaleny - AccountingRecord created from balance belonging to document of type ApprovedBudget (2)
    RozPz // Rozpocet po zmenach (upraveny) - AccountingRecord created from balance belonging to document of type EditedBudget (3)
}