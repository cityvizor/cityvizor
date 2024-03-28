namespace Cityvizor.Importer.Domain.Dtos;

public record struct AccountingAndPayments(
    AccountingRecord[] AccountingRecords,
    PaymentRecord[] PaymentRecords
);
