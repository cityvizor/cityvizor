using Cityvizor.Importer.Convertor.Kxx.Dtos.Enums;

namespace Cityvizor.Importer.Convertor.Kxx.Dtos;
internal record Document(
    string Ico,
    uint AccountingYear,
    byte Month,
    DocumentType DocumentType,
    InputIndetifier InputIndetifier,
    Dictionary<string, string> Descriptions,
    Dictionary<string, string> EvkDescriptions,
    List<DocumentBalance> Balances
)
{
    internal Document(KxxDocumentBlockHeader header) : this(
        Ico: header.Ico,
        AccountingYear: header.AccountingYear,
        Month: header.Month,
        DocumentType: header.DocumentType,
        InputIndetifier: header.InputIndetifier,
        Descriptions: new(),
        EvkDescriptions: new(),
        Balances: new())
    { }
}

internal record DocumentBalance(
    DateOnly AccountedDate,
    byte AccountedDay,
    uint DocumentNumber,
    uint SynteticAccount,
    uint AnalyticAccount,
    uint Chapter,
    uint Paraghraph,
    uint Item,
    uint RecordUnit,
    uint PurposeMark,
    ulong OrganizationUnit,
    ulong Organization,
    decimal ShouldGive,
    decimal Gave,
    List<string> Descriptions
);
