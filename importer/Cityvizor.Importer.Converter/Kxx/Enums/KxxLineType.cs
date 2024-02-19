namespace Cityvizor.Importer.Converter.Kxx.Enums;
internal enum KxxLineType
{
    // 5/@
    FileHeader,
    // 6/@
    SectionHeader,
    // G/@ 
    DocumentBalance,
    // G/#
    DocumentDescription,
    // G/$
    DocumentBalanceDescription,
}
