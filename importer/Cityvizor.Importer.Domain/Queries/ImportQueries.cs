using Cityvizor.Importer.Domain.Entities;
using Cityvizor.Importer.Domain.Enums;

namespace Cityvizor.Importer.Domain.Queries;
public static class ImportQueries
{
    public static IQueryable<Import> ByStatus(this IQueryable<Import> query, ImportStatus importStatus)
        => query.Where(import => import.Status == importStatus);

    public static IQueryable<Import> ByFormats(this IQueryable<Import> query, IEnumerable<ImportFormat> formats)
        => query.Where(import => formats.Contains(import.Format));
}
