namespace Cityvizor.Importer.Tests.Kxx
{
    internal class KxxTestData
    {
        internal const string KxxTestingDataFolderName = "Kxx/TestData";

        internal static StreamReader CreateStreamReader(string filename)
        {
            return Utils.StreamReaderFromFile(Path.Combine(KxxTestingDataFolderName, filename));
        }
    }
}
