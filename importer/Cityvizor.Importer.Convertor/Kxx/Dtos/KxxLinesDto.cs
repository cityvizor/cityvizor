using Cityvizor.Importer.Convertor.Kxx.Enums;

namespace Cityvizor.Importer.Convertor.Kxx.Dtos;

/// <summary>
/// Represents line 5/@ of .kxx file - header of the whole .kxx file
/// 5/@xxxxxxxx00yy000cccc 
/// </summary>
/// <param name="Ico"></param>
/// <param name="Month">`yy` obdobi zpracovani - mesic</param>
/// <param name="ProgramLicence">cislo licence zpracovatelskeho programu</param>
internal record struct KxxHeader(
    string Ico,
    byte Month,
    string ProgramLicence);

/// <summary>
/// Represents line 6/@ of .kxx file - header of a block representing one document (invoice?)
/// 6/@xxxxxxxxyyzz_t_rrrr 
/// </summary>
/// <param name="Ico"></param>
/// <param name="Month">`yy` obdobi zpracovani - mesic</param>
/// <param name="DocumentType"> druh dokladu</param>
/// <param name="InputIndetifier">dentifikátor vstupu</param>
/// <param name="AccountingYear"> účetní rok</param>
internal record struct KxxDocumentBlockHeader(
    string Ico,
    byte Month,
    DocumentType DocumentType,
    InputIndetifier InputIndetifier,
    uint AccountingYear 
);

/// <summary>
/// Represents G/@ line of .kxx file - one item in document (invoice)
/// G/@ddccccccccc000sssaaaakkoooooollllzzzuuuuuuuuujjjjjjjjjjgggggggggggggmmmmmmmmmmmmmmmmmm_dddddddddddddddddd_
/// </summary>
/// <param name="AccountedDay">den zauctovani</param>
/// <param name="DocumentNumber">cislo dokladu</param>
/// <param name="SynteticAccount"> syntetika (SU) </param>
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
internal record struct KxxDocumentLine(
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
    decimal Gave
);

/// <summary>
/// Represents G/$ line in .kxx file - document line description
/// G/$rrrrccccccccctttttttttttttttttttttttttttttttttttttttt...
/// </summary>
/// <param name="DocumentLineNumber"></param>
/// <param name="DocumentNumber"></param>
/// <param name="LineDescription"></param>
internal record struct KxxDocumentLineDescription(
    uint DocumentLineNumber,
    uint DocumentNumber,
    string LineDescription
);


