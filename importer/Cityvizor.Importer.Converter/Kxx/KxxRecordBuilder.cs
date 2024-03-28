using Cityvizor.Importer.Converter.Kxx.Dtos;
using Cityvizor.Importer.Converter.Kxx.Dtos.Enums;
using Cityvizor.Importer.Domain.Dtos;
using Serilog;
using System.Diagnostics.CodeAnalysis;
using System.Text.RegularExpressions;

namespace Cityvizor.Importer.Converter.Kxx;
internal class KxxRecordBuilder
{
    // some balances get filtered out based on Item number
    private const int _balanceItemFilterLowerBound = 1000; 
    private const int _balanceItemFilterUpperBound = 9000;

    // each kxx balance line contains both shouldGive and gave amounts, Item number decides how to compute overall amount for a kxx balance line
    private const int _balanceItemExpenditureLowerBound = 5000;
    private const int _balanceItemExpenditureUpperBound = 8000;

    private const string _kdf = "KDF"; // kniha doslych faktur
    private const string _kof = "KOF"; // kniha odeslych faktur
    private const string _ic = "IC";
    private const string _dict = "DICT";
    private const string _evkt = "EVKT";

    private readonly ILogger _logger;
    
    /// <summary>
    /// This set of fields of Balance determines the record to which the balance belongs
    /// </summary>
    private record struct AccountingRecordIdentifier(uint Paraghraph, uint Item, ulong Organization, ulong OrganizationUnit, AccountingRecordType RecordType);

    private record struct DocumentPaymentData(
        PaymentRecordType PaymentRecordType,
        string RecordId,
        string CounterpartyId,
        string CounterpartyName,
        string Descriptions
    );

    public KxxRecordBuilder(ILogger logger)
    {
        this._logger = logger;
    }

    public AccountingAndPayments BuildRecordsFromDocuments(KxxDocument[] documents)
    {
        List<PaymentRecord> paymentRecords = new();
        Dictionary<AccountingRecordIdentifier, AccountingRecordBuilder> accountingRecords = new();

        foreach (KxxDocument document in documents) 
        {
            if (!ValidateDocumentType(document, out AccountingRecordType? accountingRecordType) || !ValidateEvkDescriptions(document))
            {
                continue;
            }

            if (IsPaymentDocument(document, out PaymentRecordType? paymentRecordType, out string? recordId)) // payment records
            {
                if(!TryGetDocumentPaymentData(document, paymentRecordType.Value, recordId, out DocumentPaymentData? paymentData)) // parse common document data only once for all document balances
                {
                    continue;
                }

                paymentRecords.AddRange(
                    FilterRelevantBalances(document.Balances)
                    .Select(balance => BuildPaymentRecord(paymentData.Value, balance)));
            }
            else // accounting records
            {
                foreach(DocumentBalance relevantBalance in FilterRelevantBalances(document.Balances)) 
                {
                    ProcessAccountingBalance(relevantBalance, accountingRecordType.Value, accountingRecords);
                }
            }
        }

        return new AccountingAndPayments(
            AccountingRecords: accountingRecords.Values.Select(recordBuilder => recordBuilder.ToAccountingRecord()).ToArray(),
            PaymentRecords: paymentRecords.ToArray()
        );
    }

    private void ProcessAccountingBalance(DocumentBalance balance, AccountingRecordType accountingRecordType, Dictionary<AccountingRecordIdentifier, AccountingRecordBuilder> accountingRecords) 
    {
        AccountingRecordIdentifier recordIdentifier = GetAccountingBalanceIdentifier(balance, accountingRecordType);
        if(!accountingRecords.TryGetValue(recordIdentifier, out AccountingRecordBuilder? accountingRecord))
        {
            accountingRecord = new AccountingRecordBuilder {
                Type = accountingRecordType,
                Paragraph = balance.Paraghraph,
                Item = balance.Item,
                Event = balance.Organization, // beware Organization gets mapped to Event
                RecordUnit = balance.OrganizationUnit,
                Amount = ComputeAmount(balance)
            };
            accountingRecords.Add( recordIdentifier, accountingRecord );
        }
        else
        {
            accountingRecord.Amount += ComputeAmount(balance);
        }
    }

    private static AccountingRecordIdentifier GetAccountingBalanceIdentifier(DocumentBalance balance, AccountingRecordType accountingRecordType)
    {
        return new AccountingRecordIdentifier(
            Paraghraph: balance.Paraghraph,
            Item: balance.Item,
            Organization: balance.Organization, 
            OrganizationUnit: balance.OrganizationUnit, 
            RecordType: accountingRecordType
        );
    }

    private PaymentRecord BuildPaymentRecord(DocumentPaymentData document, DocumentBalance balance) 
    {
        return new PaymentRecord(
            Type: document.PaymentRecordType,
            AccountedDate: balance.AccountedDate,
            RecordId: document.RecordId,
            CounterpartyId: document.CounterpartyId,
            CounterpartyName: document.CounterpartyName,
            Amount: ComputeAmount(balance),
            Description: document.Descriptions,
            Paragraph: balance.Paraghraph,
            Item: balance.Item,
            Event: balance.Organization, // beware Organization gets mapped to Event
            RecordUnit: balance.OrganizationUnit
        );
    }

    private bool TryGetDocumentPaymentData(KxxDocument document, PaymentRecordType paymentRecordType, string recordId, [NotNullWhen(true)] out DocumentPaymentData? paymentData)
    {
        bool success = true;
        paymentData = null;
        if (!document.Descriptions.TryGetValue(_ic, out string? counterpartyId))
        {
            success = false;
            LogDocumentError(document, $"is missing description with key {_ic}: counterpartyId");
        }
        if(!document.Descriptions.TryGetValue(_dict, out string? counterpartyName))
        {
            success = false;
            LogDocumentError(document, $"is missing description with key {_dict}: counterpartyName");
        }
        if (success)
        {
            // TODO: original implementation was concatenating plainTextDesriptions using \n and the splitting them again using regex that should probably match both windows and unix newlines, is it necessary?  
            // original implementation: description: record.meta["EVKT"] || record.comments.join("\n").split(/\r?\n/)[0],
            string pattern = @"\r?\n"; // this should match both windows and unix newlines
            document.Descriptions.TryGetValue(_evkt, out string? evktDescription);
            string description = evktDescription ?? Regex.Split(string.Join('\n', document.PlainTextDescriptions), pattern).FirstOrDefault("");

            paymentData = new DocumentPaymentData(
                PaymentRecordType: paymentRecordType, RecordId: recordId, CounterpartyId: counterpartyId!, CounterpartyName: counterpartyName!, Descriptions: description);
        }
        return success;
    }

    private void LogDocumentError(KxxDocument document, string message) 
    {
        _logger.Error($"Invalid kxx document: Kxx document with id {document.DocumentId}, ICO: {document.Ico}, for period: {document.AccountingMonth} {document.AccountingYear}: {message} Document will be ignored.");
    }

    /// <summary>
    /// KOF means "kniha odeslych faktur", KDF means "kniha doslych faktur", it make no sense for a payment to belong to both as once 
    /// </summary>
    /// <param name="document"></param>
    /// <returns></returns>
    private bool ValidateEvkDescriptions(KxxDocument document)
    {
        if(document.EvkDescriptions.ContainsKey(_kof) && document.EvkDescriptions.ContainsKey(_kdf)) 
        {
            LogDocumentError(document, $"contains both {_kdf} and {_kof} in its EVK descriptions. Document will be ignored.");
            return false;
        }
        return true;
    }

    private bool ValidateDocumentType(KxxDocument document, [NotNullWhen(true)] out AccountingRecordType? accountingRecordType)
    {
        switch (document.DocumentType) 
        {
            case DocumentType.OrdinaryMonth:
                accountingRecordType = AccountingRecordType.Pok;
                return true;
            case DocumentType.ApprovedBudget:
                accountingRecordType = AccountingRecordType.RozSch;
                return true;
            case DocumentType.EditedBudget:
                accountingRecordType = AccountingRecordType.RozPz;
                return true;
            default:
                LogDocumentError(document, $"has unexpected document type: {document.DocumentType} ({(int)document.DocumentType}).");
                accountingRecordType = null;
                return false;
        }
    }

    /// <summary>
    /// Document is considered payment if it contains values KOF or KDF key in its EVK descriptions
    /// </summary>
    /// <param name="document"></param>
    /// <param name="type"></param>
    /// <returns></returns>
    private static bool IsPaymentDocument(KxxDocument document, [NotNullWhen(true)] out PaymentRecordType? type, [NotNullWhen(true)] out string? documentId)
    {
        if (document.EvkDescriptions.TryGetValue(_kof, out documentId))
        {
            type = PaymentRecordType.Kof;
            return true;
        }
        if (document.EvkDescriptions.TryGetValue(_kdf, out documentId))
        {
            type = PaymentRecordType.Kdf;
            return true;
        }
        type = null; 
        return false;
    }

    private DocumentBalance[] FilterRelevantBalances(List<DocumentBalance> balances) 
    {
        List<DocumentBalance> filteredBalances = new();
        foreach (DocumentBalance balance in balances) // using linq would create capture containing _logger
        {
            if (!IsRelevantBalance(balance))
            {
                _logger.Warning($"Balance with documentId {balance.DocumentId} and accountedDate {balance.AccountedDate} will be ignored because it has unsupported item number {balance.Item}.");
            }
            else
            {
                filteredBalances.Add(balance);
            }
        }
        return filteredBalances.ToArray();
    }

    // TODO: move this to Importer layer so that this filter gets applied to all imports not just to .kxx 
    private static bool IsRelevantBalance(DocumentBalance kxxDocumentBalance)
    {
        // other item numbers should be just technical and irrelevant for our purposes, bit I have no clue why
        // TODO: Sebek also manually filtered out some other Item numbers, add them here? 
        return kxxDocumentBalance.Item > _balanceItemFilterLowerBound && kxxDocumentBalance.Item < _balanceItemFilterUpperBound;
    }

    private static decimal ComputeAmount(DocumentBalance kxxDocumentBalance) 
    {
        // original javascript implementation return (Number(balance.pol) >= 5000 && Number(balance.pol) < 8000) ? balance.d - balance.md : balance.md - balance.d;
        return (kxxDocumentBalance.Item >= _balanceItemExpenditureLowerBound && kxxDocumentBalance.Item < _balanceItemExpenditureUpperBound)
          ? kxxDocumentBalance.Gave - kxxDocumentBalance.ShouldGive
          : kxxDocumentBalance.ShouldGive - kxxDocumentBalance.Gave;
    }
}
