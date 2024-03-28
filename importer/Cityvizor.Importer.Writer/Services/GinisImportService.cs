using Cityvizor.Importer.Converter.Kxx;
using Cityvizor.Importer.Domain.Abstractions.Repositories;
using Cityvizor.Importer.Domain.Dtos;
using Cityvizor.Importer.Domain.Entities;
using Cityvizor.Importer.Domain.Enums;
using Cityvizor.Importer.Domain.Exceptions;
using Cityvizor.Importer.Writer.Dtos;
using Serilog;

namespace Cityvizor.Importer.Writer.Services;
public class GinisConversionService
{
    private readonly FileSystemService _fileSystemService;
    private readonly KxxConverter _kxxConverter;
    private readonly IRepository<Import> _importRepository;

    public GinisConversionService(FileSystemService fileSystemService, KxxConverter kxxConverter, IRepository<Import> importRepository)
    {
        _fileSystemService = fileSystemService;
        _kxxConverter = kxxConverter;
        _importRepository = importRepository;
    }

    public async Task ConvertGinisDataToCitivizorFormat(Import import, ILogger importScopedLogger)
    {
        if(import.ImportDir is null) 
        {
            throw new CityvizorImporterException($"Ginis import has null {nameof(import.ImportDir)} field.");
        }
        if(Path.GetFileName(import.ImportDir) != Constants.ImportMetadataFileName)
        {
            throw new CityvizorImporterException($"Ginis import does not have valid {Constants.ImportMetadataFileName} file.");
        }

        GinisImportMetadataDto importMetadata = _fileSystemService.ReadMetadateJsonFile<GinisImportMetadataDto>(import.ImportDir);

        if(importMetadata.AccoutingFileName is null && importMetadata.BudgetFileName is null)
        {
            throw new CityvizorImporterException("Ginis import missing both accounting and budget files");
        }

        string importDirectory = Path.GetDirectoryName(import.ImportDir) ?? throw new CityvizorImporterException($"Ginis import with invalid {nameof(import.ImportDir)} field: {import.ImportDir}");

        // parse .kxx
        List<AccountingRecord> accountingRecords = new();
        List<PaymentRecord> paymentRecords = new();
        if(importMetadata.AccoutingFileName is not null)
        {
            AccountingAndPayments accountingData = _kxxConverter.ParseRecords(new StreamReader(importMetadata.AccoutingFileName), importScopedLogger);
            accountingRecords.AddRange(accountingData.AccountingRecords);
            paymentRecords.AddRange(accountingData.PaymentRecords);
        }
        if (importMetadata.BudgetFileName is not null)
        {
            AccountingAndPayments budgetData = _kxxConverter.ParseRecords(new StreamReader(importMetadata.BudgetFileName), importScopedLogger);
            accountingRecords.AddRange(budgetData.AccountingRecords);
            paymentRecords.AddRange(budgetData.PaymentRecords);
        }

        // write data to .csv on server        
        await _fileSystemService.WriteToCsvAsync(accountingRecords, Path.Combine(importDirectory, Constants.AccountingFileName));
        await _fileSystemService.WriteToCsvAsync(paymentRecords, Path.Combine(importDirectory, Constants.PaymentsFileName));

        // update import record in db
        import.Format = ImportFormat.Cityvizor; // data was parsed to cityvizor format
        await _importRepository.SaveChangesAsync();
    }
}
