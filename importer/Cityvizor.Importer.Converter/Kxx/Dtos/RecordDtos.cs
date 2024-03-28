using Cityvizor.Importer.Domain.Dtos;

namespace Cityvizor.Importer.Converter.Kxx.Dtos;

/// <summary>
/// AccountingRecord on core layer is record and therefore it is readonly (which is desirable)
/// When building accounting record from balances, however, I need to modify amount, therefore I need to have a mutable variant of dto
/// </summary>
internal class AccountingRecordBuilder
{
    public AccountingRecordType Type { get; set; }
    public uint Paragraph { get; set; }
    public uint Item { get; set; }
    public  ulong Event { get; set; } // organization
    public ulong RecordUnit { get; set; } // organizationUnit
    public decimal Amount { get; set; }

    public AccountingRecord ToAccountingRecord()
    {
        return new AccountingRecord(
            Type: this.Type,
            Paragraph: this.Paragraph,
            Item: this.Item,
            Event: this.Event,
            RecordUnit: this.RecordUnit,
            Amount: this.Amount);
    }
}
    
