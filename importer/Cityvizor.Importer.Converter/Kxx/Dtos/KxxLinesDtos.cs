using Cityvizor.Importer.Converter.Kxx.Dtos.Enums;

namespace Cityvizor.Importer.Converter.Kxx.Dtos;

/// <summary>
/// Represents line 5/@ of .kxx file - header of the whole .kxx file
/// 5/@xxxxxxxx00yy000cccc 
/// </summary>
/// <param name="Ico"></param>
/// <param name="AccountingMonth">`yy` obdobi zpracovani - mesic</param>
/// <param name="ProgramLicence">cislo licence zpracovatelskeho programu</param>
internal record struct KxxFileHeader(
    string Ico,
    ushort AccountingMonth, // we don't use it for anything rn
    string ProgramLicence);

/// <summary>
/// Represents line 6/@ of .kxx file - header of a block representing one section (month + input identifier)
/// 6/@xxxxxxxxyyzz_t_rrrr 
/// </summary>
/// <param name="Ico"></param>
/// <param name="AccountingMonth">`yy` obdobi zpracovani - mesic</param>
/// <param name="DocumentType"> druh dokladu</param>
/// <param name="InputIndetifier">dentifikátor vstupu</param>
/// <param name="AccountingYear"> účetní rok</param>
internal record struct KxxSectionHeader(
    string Ico,
    ushort AccountingMonth,
    DocumentType DocumentType,
    InputIdentifier InputIndetifier,
    ushort AccountingYear 
);

/// <summary>
/// Represents G/@ line of .kxx file - one balance in document (invoice)
/// G/@ddccccccccc000sssaaaakkoooooollllzzzuuuuuuuuujjjjjjjjjjgggggggggggggmmmmmmmmmmmmmmmmmm_dddddddddddddddddd_
/// </summary>
/// <param name="AccountedDay">den zauctovani</param>
/// <param name="DocumentId">cislo dokladu</param>
/// <param name="SyntheticAccount"> syntetika (SU) </param>
/// <param name="AnalyticAccount">analytika (AU)</param>
/// <param name="Chapter">kapitola(KAP) </param>
/// <param name="Paraghraph"> oddíl,paragraf (ODPA)</param>
/// <param name="Item">položka (POL) </param>
/// <param name="RecordUnit">záznamová jednotka (ZJ) </param>
/// <param name="PurposeMark"> účelový znak (UZ)</param>
/// <param name="OrganizationUnit"> organizační jednotka (ORJ) </param>
/// <param name="Organization">organizace (ORG) </param>
/// <param name="ShouldGive">má dáti </param>
/// <param name="Gave">dal</param>
internal record struct KxxDocumentBalance(
    ushort AccountedDay,
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
    decimal Gave
);

/// <summary>
/// Represents G/$ line in .kxx file - balance description
/// G/$rrrrccccccccctttttttttttttttttttttttttttttttttttttttt...
/// </summary>
/// <param name="DocumentLineNumber">jednoznačné číslo řádky v dokladu v rámci dokladu </param>
/// <param name="DocumentNumber">číslo dokladu</param>
/// <param name="LineDescription"> text k řádku dokladu</param>
internal record struct KxxDocumentBalanceDescription(
    uint DocumentLineNumber,
    uint DocumentId,
    string BalanceDescription
);

/// <summary>
/// Represents G/# line in .kxx file - document description
/// G/$rrrrccccccccctttttttttttttttttttttttttttttttttttttttt...
/// </summary>
/// <param name="DocumentLineNumber"> jednoznačné číslo řádky popisu v rámci dokladu </param>
/// <param name="DocumentId">číslo dokladu</param>
/// <param name="Descriptions"> text k řádku dokladu</param>
/// <param name="EvkDescriptions"> text k řádku dokladu</param>
internal record struct KxxDocumentDescription (
    uint DocumentLineNumber,
    uint DocumentId,
    Dictionary<string, string> Descriptions,
    Dictionary<string, string> EvkDescriptions,
    string[] PlainTextDescription
);