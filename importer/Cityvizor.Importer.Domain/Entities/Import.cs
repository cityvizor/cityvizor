using Cityvizor.Importer.Domain.Enums;

namespace Cityvizor.Importer.Domain.Entities;

public class Import
{
    public int Id { get; set; }
    public int ProfileId { get; set; }
    public int Year { get; set; }
    public int? UserId { get; set; }
    public DateTime Created { get; set; }
    public DateTime? Started { get; set; }
    public DateTime? Finished { get; set; }
    public ImportStatus Status { get; set; }
    public string? Error { get; set; }
    public DateTime? Validity { get; set; }
    public bool Append { get; set; }
    public string? Logs { get; set; }
    public ImportFormat Format { get; set; }
    public string? ImportDir { get; set; }
}
