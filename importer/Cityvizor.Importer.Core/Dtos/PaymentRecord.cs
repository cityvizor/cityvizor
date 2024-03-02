namespace Cityvizor.Importer.Core.Dtos;

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
    uint Event, // TODO: what gets mapped to this?
    uint RecordUnit
);

public enum PaymentRecordType
{
    Kdf, // kniha doslych faktur
    Kof // kniha odeslych faktur
}
