using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cityvizor.Importer.UnitTests;
internal static class Utils
{
    public static StreamReader StreamReaderFromString(string inputString)
    {
        byte[] byteArray = Encoding.UTF8.GetBytes(inputString);
        MemoryStream memoryStream = new MemoryStream(byteArray);
        StreamReader streamReader = new StreamReader(memoryStream, Encoding.UTF8);
        return streamReader;
    }
}
