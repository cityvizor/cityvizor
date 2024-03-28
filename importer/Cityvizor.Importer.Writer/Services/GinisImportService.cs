using Cityvizor.Importer.Converter.Kxx;
using Cityvizor.Importer.Domain.Abstractions.Repositories;
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

    public async Task ConverGinisDataToCitivizorFormat(Import import, ILogger importScopedLogger)
    {
        if(import.ImportDir is null) 
        {
            throw new CityvizorImporterException($"Import with if id {import.Id} has null {nameof(import.ImportDir)} field.");
        }

        GinisImportMetadataDto importMetadata = _fileSystemService.ReadMetadateJsonFile<GinisImportMetadataDto>(import.ImportDir);

        if(importMetadata.AccoutingFileName is not null)
        {
            Domain.Dtos.AccountingAndPayments accountingData = _kxxConverter.ParseRecords(new StreamReader(importMetadata.AccoutingFileName), importScopedLogger);
        }
        if (importMetadata.BudgetFileName is not null)
        {
            Domain.Dtos.AccountingAndPayments budgetData = _kxxConverter.ParseRecords(new StreamReader(importMetadata.BudgetFileName), importScopedLogger);
        }

        import.Format = ImportFormat.Cityvizor; // data was parsed to cityvizor format
        await _importRepository.SaveChangesAsync();
    }
}
