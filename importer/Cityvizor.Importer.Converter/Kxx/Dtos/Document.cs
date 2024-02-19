using Cityvizor.Importer.Converter.Kxx.Dtos.Enums;

namespace Cityvizor.Importer.Converter.Kxx.Dtos;

/// <summary>
/// 
/// </summary>
/// <param name="SectionType"></param>
/// <param name="InputIdentifier"></param>
/// <param name="Ico"></param>
/// <param name="AccountingYear"></param>
/// <param name="AccountingMonth"></param>
/// <param name="DocumentId"></param>
/// <param name="Descriptions"></param>
/// <param name="EvkDescriptions"></param>
/// <param name="PlainTextDescriptions"></param>
/// <param name="Balances"></param>
public record Document(
    SectionType SectionType,
    InputIdentifier InputIdentifier,

    string Ico,
    ushort AccountingYear,
    byte AccountingMonth,
    uint DocumentId,

    Dictionary<string, string> Descriptions,
    Dictionary<string, string> EvkDescriptions,
    List<string> PlainTextDescriptions,
    List<DocumentBalance> Balances
)
{
    internal Document(KxxSectionHeader header, uint documentId) : this(
        Ico: header.Ico,
        AccountingYear: header.AccountingYear,
        AccountingMonth: header.AccountingMonth,
        DocumentId: documentId,
        SectionType: header.SectionType,
        InputIdentifier: header.InputIndetifier,
        Descriptions: new(),
        EvkDescriptions: new(),
        PlainTextDescriptions: new(),
        Balances: new())
    { }
}

public record DocumentBalance(
    DateOnly AccountedDate,
    uint DocumentId,
    uint SyntheticAccount,
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
)
{
    internal DocumentBalance(KxxDocumentBalance balanceLine, ushort year, byte month) : this(
        AccountedDate: new DateOnly(year, month, balanceLine.AccountedDay), // compose balance date from day on the balance line and year and month in balance header
        DocumentId: balanceLine.DocumentId,
        SyntheticAccount: balanceLine.SyntheticAccount,
        AnalyticAccount: balanceLine.AnalyticAccount,
        Chapter: balanceLine.Chapter,
        Paraghraph: balanceLine.Paraghraph,
        Item: balanceLine.Item,
        RecordUnit: balanceLine.RecordUnit,
        PurposeMark: balanceLine.PurposeMark,
        OrganizationUnit: balanceLine.OrganizationUnit,
        Organization: balanceLine.Organization,
        ShouldGive: balanceLine.ShouldGive,
        Gave: balanceLine.Gave,
        Descriptions: new()
        )
    { }
}
