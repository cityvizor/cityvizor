using Cityvizor.Importer.Domain.Abstractions.Repositories;
using Cityvizor.Importer.Domain.Entities;
using Cityvizor.Importer.Domain.Enums;
using Cityvizor.Importer.Domain.Queries;
using Microsoft.EntityFrameworkCore;

namespace Cityvizor.Importer.Writer.Services;
public class JobManagerService
{
    private readonly Dictionary<ImportFormat, Func<Import, Task>> _supportedFormats;

    private readonly IRepository<Import> _importRepository;
    private readonly GinisConversionService _ginisConversionService;

    public JobManagerService(IRepository<Import> importRepository, GinisConversionService ginisConversionService)
    {
        this._importRepository = importRepository;
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
            var importHanlder = _supportedFormats[import.Format];
            importTasks.Add(importHanlder(import));
        }

        await Task.WhenAll(importTasks);
    }
}
