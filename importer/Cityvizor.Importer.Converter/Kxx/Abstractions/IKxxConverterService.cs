namespace Cityvizor.Importer.Converter.Kxx.Abstractions;
public interface IKxxParserFactoryService
{
    public KxxParser CreateParser(StreamReader stream);
}
