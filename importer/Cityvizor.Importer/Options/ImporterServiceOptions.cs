namespace Cityvizor.Importer.Options;

public class ImporterServiceOptions
{
    public bool Enabled { get; set; }

    public TimeSpan ServiceFrequency { get; set; }
}
