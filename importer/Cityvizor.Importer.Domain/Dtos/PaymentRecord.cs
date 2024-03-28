namespace Cityvizor.Importer.Domain.Dtos;

public record PaymentRecord(
    PaymentRecordType Type,
    DateOnly AccountedDate,
    string RecordId,
    string CounterpartyId,
    string CounterpartyName,
    decimal Amount,
    string Description,
    uint Paragraph,
    uint Item,
    ulong Event, // organization
    ulong RecordUnit //  organization unit
);

public enum PaymentRecordType
{
    Kdf, // kniha doslych faktur
    Kof // kniha odeslych faktur
}
