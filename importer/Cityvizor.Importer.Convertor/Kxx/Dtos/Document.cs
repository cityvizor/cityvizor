using Cityvizor.Importer.Convertor.Kxx.Dtos.Enums;

namespace Cityvizor.Importer.Convertor.Kxx.Dtos;
internal record Document(
    string Ico,
    string ProgramLicence,
    uint AccountingYear,
    byte Month,
    DocumentType DocumentType,
    InputIndetifier InputIndetifier,
    Dictionary<string, string> Descriptions,
    Dictionary<string, string> EkvDescriptions,
    List<DocumentBalance> Balances
);

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
