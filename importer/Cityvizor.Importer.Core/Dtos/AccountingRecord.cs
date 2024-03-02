namespace Cityvizor.Importer.Core;

public record AccountingRecord(
    AccountingRecordType Type,
    uint Paragraph,
    uint Item,
    uint Event, // TODO: what gets mapped to this?
    uint RecordUnit,
    decimal Amount
);

// TODO: beware - original demo implementation was only producing AccountingRecords of 2 types - POK and ROZ
// as summing together ApprovedBudget and EditedBudget is one of the possible causes of Brno-Medlanky issues
// I've decided to split approved and edited budgets to separate records so that we can potentially deal with them separately
// this may require changes in Cityvizor logic
public enum AccountingRecordType
{
    Pok, // AccountingRecord created from balance belonging to document of type OrdinaryMonth (0)
    RozApproved, // AccountingRecord created from balance belonging to document of type ApprovedBudget (2)
    RozEdited // AccountingRecord created from balance belonging to document of type EditedBudget (3)
}