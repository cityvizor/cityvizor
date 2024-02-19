using Cityvizor.Importer.Converter.Kxx.Dtos.Enums;

namespace Cityvizor.Importer.Converter.Kxx.Dtos;

/// <summary>
/// Represents one invoice document
/// </summary>
/// <param name="SectionType">Type of the document</param>
/// <param name="InputIdentifier">Mode in which this document should be processed - append, rewrite...</param>
/// <param name="Ico"></param>
/// <param name="AccountingYear"></param>
/// <param name="AccountingMonth"></param>
/// <param name="DocumentId"></param>
/// <param name="Descriptions">from G/# line</param>
/// <param name="EvkDescriptions">from G/# line, key-value pairs that were prefixed by EVK in original kxx data</param>
/// <param name="PlainTextDescriptions">from G/# line that did not have dictionary format</param>
/// <param name="Balances">list of records, one for each G/@ line belonging to this document</param>
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

/// <summary>
/// Represents one balance of a document
/// </summary>
/// <param name="AccountedDate"></param>
/// <param name="DocumentId"></param>
/// <param name="SyntheticAccount"></param>
/// <param name="AnalyticAccount"></param>
/// <param name="Chapter"></param>
/// <param name="Paraghraph"></param>
/// <param name="Item"></param>
/// <param name="RecordUnit"></param>
/// <param name="PurposeMark"></param>
/// <param name="OrganizationUnit"></param>
/// <param name="Organization"></param>
/// <param name="ShouldGive"></param>
/// <param name="Gave"></param>
/// <param name="Descriptions">from G/$ line</param>
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
