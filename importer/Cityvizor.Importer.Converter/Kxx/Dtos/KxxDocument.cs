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
public record KxxDocument(
    DocumentType SectionType,
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
    internal KxxDocument(KxxSectionHeader header, uint documentId) : this(
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
/// <param name="DocumentId"> cislo dokladu</param>
/// <param name="SyntheticAccount">syntetika (SU)</param>
/// <param name="AnalyticAccount">analytika (AU)</param>
/// <param name="Chapter">kapitola(KAP)</param>
/// <param name="Paraghraph"> oddíl,paragraf (ODPA) </param>
/// <param name="Item">položka (POL)</param>
/// <param name="RecordUnit">záznamová jednotka (ZJ)</param>
/// <param name="PurposeMark">účelový znak (UZ) </param>
/// <param name="OrganizationUnit"> organizační jednotka (ORJ) </param>
/// <param name="Organization">organizace (ORG) </param>
/// <param name="ShouldGive">má dáti</param>
/// <param name="Gave"> dal</param>
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
