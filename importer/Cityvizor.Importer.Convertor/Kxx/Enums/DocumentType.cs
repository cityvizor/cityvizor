namespace Cityvizor.Importer.Convertor.Kxx.Enums;
enum DocumentType
{
    /// <summary>
    /// 00 = běžný měsíc 
    /// </summary>
    OrdinaryMonth = 0,
    /// <summary>
    /// 01 počáteční stavy 
    /// </summary>
    InitialStates = 1,
    /// <summary>
    /// 02 = rozpočet schválený
    /// </summary>
    ApprovedBudget = 2,
    /// <summary>
    /// 03 = rozpočet upravený (interní)
    /// </summary>
    InternalBudget = 3,
    /// <summary>
    /// 04 = závěrečné zápisy 
    /// </summary>
    FinalizingRecords = 4,
    /// <summary>
    /// 05 = uzavírací zápisy 
    /// </summary>
    FinalRecord = 5,
    /// <summary>
    /// 06 = blokace rozpočtu 
    /// </summary>
    BudgetBlock = 6,
    /// <summary>
    /// 07 = rozpočet resortní 
    /// </summary>
    MinistryBudget = 7,
    /// <summary>
    /// 08 = rozpočet vládní 
    /// </summary>
    GovernmentBudget = 8,
    /// <summary>
    /// 09 = požadavek na rozpočet
    /// </summary>
    BudgetRequest = 9,
    /// <summary>
    /// Type that was not in .kxx documentation
    /// </summary>
    Unknown
}