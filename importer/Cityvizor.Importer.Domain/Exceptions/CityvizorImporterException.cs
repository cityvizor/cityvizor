namespace Cityvizor.Importer.Domain.Exceptions;
public class CityvizorImporterException : Exception
{
    public CityvizorImporterException()
    {
    }

    public CityvizorImporterException(string message)
        : base(message)
    {
    }

    public CityvizorImporterException(string message, Exception inner)
        : base(message, inner)
    {
    }
}
