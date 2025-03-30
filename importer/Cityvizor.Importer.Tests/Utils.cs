using System.Text;

namespace Cityvizor.Importer.Tests;

internal static class Utils
{
    internal static StreamReader StreamReaderFromString(string inputString)
    {
        byte[] byteArray = Encoding.UTF8.GetBytes(inputString);
        MemoryStream memoryStream = new(byteArray);
        StreamReader streamReader = new(memoryStream, Encoding.UTF8);
        return streamReader;
    }

    internal static StreamReader StreamReaderFromFile(string filename)
    {
        var directory = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
        var path = Path.Combine(directory!, filename);
        return new StreamReader(path);
    }
}
