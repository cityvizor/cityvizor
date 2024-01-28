namespace Cityvizor.Importer.Convertor.Kxx.Dtos.Enums;

internal enum InputIndetifier
{
    /// <summary>
    /// 0,1 = připojí doklad k existujícímu dokladu
    /// </summary>
    Add = 1,
    /// <summary>
    /// 2 = přepíše existující doklad se stejnou licencí 
    /// </summary>
    RewriteWithSameLicence = 2,
    /// <summary>
    /// 3 = přepíše existující doklad bez ohledu na licenci 
    /// </summary>
    Rewrite = 3,
    /// <summary>
    /// 4 = před vstupem vymaže kompletní měsíční data 
    /// </summary>
    DeleteCompletely = 4,
    /// <summary>
    /// 5 = před vstupem vymaže kompletní měsíční data a po vstupu přepočte stavy 
    /// </summary>
    DeleteCompletelyAndRecount = 5,
    /// <summary>
    /// 6 = před vstupem vymaže data podle měsíce a druhu dokladu 
    /// </summary>
    DeleteByMonthAndType = 6,
    /// <summary>
    /// 7 = před vstupem vymaže data podle měsíce a druhu dokladu a po vstupu přepočte stavy 
    /// </summary>
    DeleteByMonthAndTypeAndRecount = 7,
}
