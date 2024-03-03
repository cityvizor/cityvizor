namespace Cityvizor.Importer.Core.Dtos;

public record struct AccountingAndPayments(
    AccountingRecord[] AccountingRecords,
    PaymentRecord[] PaymentRecords
);
