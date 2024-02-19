using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cityvizor.Importer.UnitTests;
internal static class Utils
{
    internal const string KxxTestingDataFolderName = "KxxTestingData";

    public static StreamReader StreamReaderFromString(string inputString)
    {
        byte[] byteArray = Encoding.UTF8.GetBytes(inputString);
        MemoryStream memoryStream = new MemoryStream(byteArray);
        StreamReader streamReader = new StreamReader(memoryStream, Encoding.UTF8);
        return streamReader;
    }

    public static StreamReader StreamReaderFromKxxTestingDataTestFile(string filename)
    {
        return StreamReaderFromTestFile(System.IO.Path.Combine(KxxTestingDataFolderName, filename));
    }

    public static StreamReader StreamReaderFromTestFile(string filename)
    {
        var directory = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
        var path = System.IO.Path.Combine(directory!, filename);
        return new StreamReader(path);
    }
}
