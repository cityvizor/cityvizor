using Cityvizor.Importer.Domain.Enums;

namespace Cityvizor.Importer.Writer.Dtos;

internal record ImportMetadataDto(
    ImportFormat ImportFormat,
    int ImportId);

internal record GinisImportMetadataDto(
    ImportFormat ImportFormat,
    int ImportId,
    string? AccoutingFileName,
    string? BudgetFileName)
    : ImportMetadataDto(ImportFormat, ImportId);
