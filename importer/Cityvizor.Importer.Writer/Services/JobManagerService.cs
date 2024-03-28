using Cityvizor.Importer.Domain.Abstractions.Repositories;
using Cityvizor.Importer.Domain.Entities;
using Cityvizor.Importer.Domain.Enums;
using Cityvizor.Importer.Domain.Exceptions;
using Cityvizor.Importer.Domain.Extensions;
using Cityvizor.Importer.Domain.Queries;
using Microsoft.EntityFrameworkCore;
using Serilog;

// TODO: replace Microsoft.Extension.Logging by Serilog

namespace Cityvizor.Importer.Writer.Services;
public class JobManagerService
{
    private readonly Dictionary<ImportFormat, Func<Import, ILogger, Task>> _supportedFormats;

    private readonly IRepository<Import> _importRepository;
    private readonly ILogger _logger;
    private readonly GinisConversionService _ginisConversionService;

    public JobManagerService(IRepository<Import> importRepository, ILogger logger, GinisConversionService ginisConversionService)
    {
        this._importRepository = importRepository;
        this._logger = logger;
        this._ginisConversionService = ginisConversionService;

        _supportedFormats = new()
        {
            {ImportFormat.Ginis, _ginisConversionService.ConverGinisDataToCitivizorFormat }
        };
    }

    public async Task RunJobsIfAny()
    {
        List<Import> requestedImports = await _importRepository.Query
            .ByStatus(ImportStatus.Pending)
            .ByFormats(_supportedFormats.Keys)
            .ToListAsync();

        List<Task> importTasks = new();
        foreach (Import import in requestedImports) 
        {
            if (import.ImportDir is null)
            {
                throw new CityvizorImporterException($"Import with if id {import.Id} has null {nameof(import.ImportDir)} field.");
            }

            ILogger importScopedLogger = _logger.CreateImportLogger(import.Id, $"{import.ImportDir}{Constants.LogFileName}");
            try
            {
                var importHanlder = _supportedFormats[import.Format];
                importTasks.Add(importHanlder(import, importScopedLogger));
            }
            catch (Exception ex) 
            {
                importScopedLogger.Error(ex, $"Critical error. Import {import.Id} failed.");
                import.Status = ImportStatus.Error;
                await _importRepository.SaveChangesAsync();
            }
        }

        await Task.WhenAll(importTasks);
    }
}
