using Cityvizor.Importer.Converter.Kxx;
using Cityvizor.Importer.Domain.Abstractions.Repositories;
using Cityvizor.Importer.Domain.Dtos;
using Cityvizor.Importer.Domain.Entities;
using Cityvizor.Importer.Domain.Enums;
using Cityvizor.Importer.Domain.Exceptions;
using Cityvizor.Importer.Writer.Dtos;
using Serilog;

namespace Cityvizor.Importer.Writer.Services;

public class GinisConversionService(FileSystemService fileSystemService, KxxConverter kxxConverter, IRepository<Import> importRepository)
{
    private readonly FileSystemService _fileSystemService = fileSystemService;
    private readonly KxxConverter _kxxConverter = kxxConverter;
    private readonly IRepository<Import> _importRepository = importRepository;

    public async Task ConvertGinisDataToCitivizorFormat(Import import, ILogger importScopedLogger)
    {
        if (import.ImportDir is null)
        {
            throw new CityvizorImporterException($"Ginis import has null {nameof(import.ImportDir)} field.");
        }
        // TODO: once multiple phases of the import (ginis, cityvizor) are handled by .NET importer that expects metadata json file, filename should not be fixed
        // each phase should have its own separate metadata file, phases pass the filename via importDir field in db,
        // end of phase will create new meatadata file with filenames of files the phase produced, it will update importDir in import entity to point to this new metadata file
        if (Path.GetFileName(import.ImportDir) != Constants.ImportMetadataFileName)
        {
            throw new CityvizorImporterException($"Ginis import does not have valid {Constants.ImportMetadataFileName} file.");
        }

        GinisImportMetadataDto importMetadata = FileSystemService.ReadMetadateJsonFile<GinisImportMetadataDto>(import.ImportDir);

        if (importMetadata.AccoutingFileName is null && importMetadata.BudgetFileName is null)
        {
            throw new CityvizorImporterException("Ginis import missing both accounting and budget files");
        }

        string importDirectory = Path.GetDirectoryName(import.ImportDir) ?? throw new CityvizorImporterException($"Ginis import with invalid {nameof(import.ImportDir)} field: {import.ImportDir}");

        // parse .kxx
        List<AccountingRecord> accountingRecords = [];
        List<PaymentRecord> paymentRecords = [];
        if (importMetadata.AccoutingFileName is not null)
        {
            AccountingAndPayments accountingData = KxxConverter.ParseRecords(new StreamReader(importMetadata.AccoutingFileName), importScopedLogger);
            accountingRecords.AddRange(accountingData.AccountingRecords);
            paymentRecords.AddRange(accountingData.PaymentRecords);
        }
        if (importMetadata.BudgetFileName is not null)
        {
            AccountingAndPayments budgetData = KxxConverter.ParseRecords(new StreamReader(importMetadata.BudgetFileName), importScopedLogger);
            accountingRecords.AddRange(budgetData.AccountingRecords);
            paymentRecords.AddRange(budgetData.PaymentRecords);
        }

        // write data to .csv on server        
        await FileSystemService.WriteToCsvAsync(accountingRecords, Path.Combine(importDirectory, Constants.AccountingFileName));
        await FileSystemService.WriteToCsvAsync(paymentRecords, Path.Combine(importDirectory, Constants.PaymentsFileName));

        // update import record in db
        import.Format = ImportFormat.Cityvizor; // data was parsed to cityvizor format
        import.ImportDir = importDirectory; // .js importer expects path to the directory
        await _importRepository.SaveChangesAsync();
    }
}
