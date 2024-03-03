﻿using Cityvizor.Importer.Converter.Kxx.Abstractions;
using Cityvizor.Importer.Converter.Kxx.Dtos.Enums;
using Cityvizor.Importer.Converter.Kxx.Dtos;
using Microsoft.AspNetCore.Mvc.Testing;
using Cityvizor.Importer.Core.Dtos;
using Cityvizor.Importer.Converter.Kxx;
using Cityvizor.Importer.Core;

namespace Cityvizor.Importer.UnitTests;
public class KxxConverterTests : WebTestBase
{
    public KxxConverterTests(WebApplicationFactory<Program> factory) : base(factory)
    {
        _parserService = GetRequiredService<IKxxConverterService>();
    }

    private readonly IKxxConverterService _parserService;

    [Fact]
    public void TestBuildingAccountingRecords()
    { 
        KxxDocument document1 = new KxxDocument(
           DocumentType: DocumentType.ApprovedBudget,
           InputIdentifier: InputIdentifier.RewriteWithSameLicence,
           Ico: "4499278516",
           AccountingYear: 2023,
           AccountingMonth: 1,
           DocumentId: 100001,
           Descriptions: new Dictionary<string, string>
           {
                { "OFJP", "Vlasák Petr" },
                { "OFMP", "Žebětínek 178/15, Brno, 62100, Česká republika" },
                { "DZP", "20220301"},
                { "DUD", "20220301" },
                { "PDD", "A" },
                { "ODPH", "2022" },
                { "ECDD", "16000448/17" },
                { "DICT", "Vlasák Petr" }
           },
           EvkDescriptions: new Dictionary<string, string>
           {
                { "DDP", "201316000448" }
           },
           PlainTextDescriptions: new List<string> { "Vodné a stočné Jabloňová 1a - období 28. 3. 2023 - 24. 4. 2023" },
           Balances: new List<DocumentBalance>
           {
                new DocumentBalance(
                    AccountedDate: new DateOnly(2023,1,1),
                    DocumentId: 100001,
                    SyntheticAccount: 231,
                    AnalyticAccount: 10,
                    Chapter: 0,
                    Paraghraph: 6310,
                    Item: 5163,
                    RecordUnit: 0,
                    PurposeMark: 0,
                    OrganizationUnit: 0,
                    Organization: 1610000000000u,
                    ShouldGive: 0.0m,
                    Gave: 20.60m,
                    Descriptions: new List<string>
                    {
                    }),
                new DocumentBalance(
                    AccountedDate: new DateOnly(2023,1,1),
                    DocumentId: 100001,
                    SyntheticAccount: 231,
                    AnalyticAccount: 10,
                    Chapter: 0,
                    Paraghraph: 6310,
                    Item: 5163,
                    RecordUnit: 0,
                    PurposeMark: 0,
                    OrganizationUnit: 0,
                    Organization: 1610000000000u,
                    ShouldGive: -42.0m,
                    Gave: 0,
                    Descriptions: new List<string>
                    {
                         "Zapojení nedočerpaných finančních prostředků z roku 2021 do výdajů roku 2022 na akci \"Prvky pro psí výběh\"",
                         "Nebytové hospodářství - převod finančních prostředků na pokrytí nákladů na detašované pracoviště Jabloňova 28"
                    })
               }
           );

        AccountingRecord expectedRecord1 = new(
            Type: AccountingRecordType.RozApproved,
            Paragraph: 6310,
            Item: 5163,
            Event: 1610000000000u,
            RecordUnit: 0,
            Amount: 62.60m);

        AccountingRecord expectedRecord2 = new(
            Type: AccountingRecordType.RozEdited,
            Paragraph: 6310,
            Item: 5163,
            Event: 1610000000000u,
            RecordUnit: 0,
            Amount: 62.73m);

        KxxDocument document2 = new KxxDocument(
           DocumentType: DocumentType.EditedBudget,
           InputIdentifier: InputIdentifier.RewriteWithSameLicence,
           Ico: "4499278516",
           AccountingYear: 2023,
           AccountingMonth: 1,
           DocumentId: 100001,
           Descriptions: new Dictionary<string, string>
           {
                        { "OFJP", "Vlasák Petr" },
                        { "OFMP", "Žebětínek 178/15, Brno, 62100, Česká republika" },
                        { "DZP", "20220301"},
                        { "DUD", "20220301" },
                        { "PDD", "A" },
                        { "ODPH", "2022" },
                        { "ECDD", "16000448/17" },
                        { "DICT", "Vlasák Petr" }
           },
           EvkDescriptions: new Dictionary<string, string>
           {
                        { "DDP", "201316000448" }
           },
           PlainTextDescriptions: new List<string> { "Vodné a stočné Jabloňová 1a - období 28. 3. 2023 - 24. 4. 2023" },
           Balances: new List<DocumentBalance>
           {
                new DocumentBalance(
                    AccountedDate: new DateOnly(2023,1,1),
                    DocumentId: 100001,
                    SyntheticAccount: 231,
                    AnalyticAccount: 10,
                    Chapter: 0,
                    Paraghraph: 6310,
                    Item: 5163,
                    RecordUnit: 0,
                    PurposeMark: 0,
                    OrganizationUnit: 0,
                    Organization: 1610000000000u,
                    ShouldGive: 0.0m,
                    Gave: 20.0m,
                    Descriptions: new List<string>
                    {
                    }),
                new DocumentBalance(
                    AccountedDate: new DateOnly(2023,1,1),
                    DocumentId: 100001,
                    SyntheticAccount: 231,
                    AnalyticAccount: 10,
                    Chapter: 0,
                    Paraghraph: 6310,
                    Item: 5163,
                    RecordUnit: 0,
                    PurposeMark: 0,
                    OrganizationUnit: 0,
                    Organization: 1610000000000u,
                    ShouldGive: -42.73m,
                    Gave: 0,
                    Descriptions: new List<string>
                    {
                         "Zapojení nedočerpaných finančních prostředků z roku 2021 do výdajů roku 2022 na akci \"Prvky pro psí výběh\"",
                         "Nebytové hospodářství - převod finančních prostředků na pokrytí nákladů na detašované pracoviště Jabloňova 28"
                    })
               }
           );

        KxxRecordBuilder recordBuilder = _parserService.CreateRecordBuilder();
        AccountingAndPayments result = recordBuilder.BuildRecordsFromDocuments(new KxxDocument[] { document1, document2 });
        result.PaymentRecords.Should().BeEmpty();
        result.AccountingRecords.Should().BeEquivalentTo(new[] { expectedRecord1, expectedRecord2 });
    }

    [Fact]
    public void TestBuildingPaymentRecords()
    {
        KxxDocument paymentDocument = new KxxDocument(
          DocumentType: DocumentType.ApprovedBudget,
          InputIdentifier: InputIdentifier.RewriteWithSameLicence,
          Ico: "4499278516",
          AccountingYear: 2023,
          AccountingMonth: 1,
          DocumentId: 100001,
          Descriptions: new Dictionary<string, string>
          {
                { "OFJP", "Vlasák Petr" },
                { "IC" , "66578434" },
                { "DICT", "www.kavauvas.cz" }
          },
          EvkDescriptions: new Dictionary<string, string>
          {
                { "KDF", "20231623100018" }
          },
          PlainTextDescriptions: new List<string> 
          { 
              "Vodné a stočné Jabloňová 1a - období 28. 3. 2023 - 24. 4. 2023",
              "Nebytové hospodářství - převod finančních prostředků na pokrytí nákladů na detašované pracoviště Jabloňova 28"
          },
          Balances: new List<DocumentBalance>
          {
                new DocumentBalance(
                    AccountedDate: new DateOnly(2023,1,1),
                    DocumentId: 100001,
                    SyntheticAccount: 231,
                    AnalyticAccount: 10,
                    Chapter: 0,
                    Paraghraph: 6310,
                    Item: 5163,
                    RecordUnit: 0,
                    PurposeMark: 0,
                    OrganizationUnit: 0,
                    Organization: 1610000000000u,
                    ShouldGive: 0.0m,
                    Gave: 27.60m,
                    Descriptions: new List<string>
                    {
                        "Zapojení nedočerpaných finančních prostředků z roku 2021 do výdajů roku 2022 na akci \"Prvky pro psí výběh\"", 
                    }),
                new DocumentBalance(
                    AccountedDate: new DateOnly(2023,1,1),
                    DocumentId: 100001,
                    SyntheticAccount: 231,
                    AnalyticAccount: 10,
                    Chapter: 0,
                    Paraghraph: 6310,
                    Item: 5163,
                    RecordUnit: 0,
                    PurposeMark: 0,
                    OrganizationUnit: 0,
                    Organization: 1610000000000u,
                    ShouldGive: -42.73m,
                    Gave: 20,
                    Descriptions: new List<string>
                    {
                    })
              }
          );

        PaymentRecord expectedPayment1 = new(
           Type: PaymentRecordType.Kdf,
           AccountedDate: new DateOnly(2023, 1, 1),
           RecordId: "20231623100018",
           CounterpartyId: "66578434",
           CounterpartyName: "www.kavauvas.cz",
           Amount: 27.60m,
           Description: "Vodné a stočné Jabloňová 1a - období 28. 3. 2023 - 24. 4. 2023",
           Paragraph: 6310,
           Item: 5163,
           Event: 1610000000000u,
           RecordUnit: 0);

        PaymentRecord expectedPayment2 = new(
            Type: PaymentRecordType.Kdf,
            AccountedDate: new DateOnly(2023, 1, 1),
            RecordId: "20231623100018",
            CounterpartyId: "66578434",
            CounterpartyName: "www.kavauvas.cz",
            Amount: 62.73m,
            Description: "Vodné a stočné Jabloňová 1a - období 28. 3. 2023 - 24. 4. 2023",
            Paragraph: 6310,
            Item: 5163,
            Event: 1610000000000u,
            RecordUnit: 0);

        KxxRecordBuilder recordBuilder = _parserService.CreateRecordBuilder();
        AccountingAndPayments result = recordBuilder.BuildRecordsFromDocuments(new KxxDocument[] { paymentDocument });
        result.PaymentRecords.Should().BeEquivalentTo(new PaymentRecord[] { expectedPayment1, expectedPayment2 });
        result.AccountingRecords.Should().BeEmpty();
    }

    [Fact]
    public void TestKxxRecordBuilder()
    {
        KxxDocument document1 = new KxxDocument(
          DocumentType: DocumentType.ApprovedBudget,
          InputIdentifier: InputIdentifier.RewriteWithSameLicence,
          Ico: "4499278516",
          AccountingYear: 2023,
          AccountingMonth: 1,
          DocumentId: 100001,
          Descriptions: new Dictionary<string, string>
          {
                { "OFJP", "Vlasák Petr" },
                { "OFMP", "Žebětínek 178/15, Brno, 62100, Česká republika" },
                { "DZP", "20220301"},
                { "DUD", "20220301" },
                { "PDD", "A" },
                { "ODPH", "2022" },
                { "ECDD", "16000448/17" },
                { "DICT", "Vlasák Petr" }
          },
          EvkDescriptions: new Dictionary<string, string>
          {
                { "DDP", "201316000448" }
          },
          PlainTextDescriptions: new List<string> { "Vodné a stočné Jabloňová 1a - období 28. 3. 2023 - 24. 4. 2023" },
          Balances: new List<DocumentBalance>
          {
                new DocumentBalance(
                    AccountedDate: new DateOnly(2023,1,1),
                    DocumentId: 100001,
                    SyntheticAccount: 231,
                    AnalyticAccount: 10,
                    Chapter: 0,
                    Paraghraph: 6310,
                    Item: 5163,
                    RecordUnit: 0,
                    PurposeMark: 0,
                    OrganizationUnit: 0,
                    Organization: 1610000000000u,
                    ShouldGive: 0.0m,
                    Gave: 20.60m,
                    Descriptions: new List<string>
                    {
                    }),
                new DocumentBalance(
                    AccountedDate: new DateOnly(2023,1,1),
                    DocumentId: 100001,
                    SyntheticAccount: 231,
                    AnalyticAccount: 10,
                    Chapter: 0,
                    Paraghraph: 6310,
                    Item: 5163,
                    RecordUnit: 0,
                    PurposeMark: 0,
                    OrganizationUnit: 0,
                    Organization: 1610000000000u,
                    ShouldGive: -42.0m,
                    Gave: 0,
                    Descriptions: new List<string>
                    {
                         "Zapojení nedočerpaných finančních prostředků z roku 2021 do výdajů roku 2022 na akci \"Prvky pro psí výběh\"",
                         "Nebytové hospodářství - převod finančních prostředků na pokrytí nákladů na detašované pracoviště Jabloňova 28"
                    })
              }
          );

        KxxDocument document2 = new KxxDocument(
           DocumentType: DocumentType.EditedBudget,
           InputIdentifier: InputIdentifier.RewriteWithSameLicence,
           Ico: "4499278516",
           AccountingYear: 2023,
           AccountingMonth: 1,
           DocumentId: 100001,
           Descriptions: new Dictionary<string, string>
           {
                        { "OFJP", "Vlasák Petr" },
                        { "OFMP", "Žebětínek 178/15, Brno, 62100, Česká republika" },
                        { "DZP", "20220301"},
                        { "DUD", "20220301" },
                        { "PDD", "A" },
                        { "ODPH", "2022" },
                        { "ECDD", "16000448/17" },
                        { "DICT", "Vlasák Petr" }
           },
           EvkDescriptions: new Dictionary<string, string>
           {
                        { "DDP", "201316000448" }
           },
           PlainTextDescriptions: new List<string> { "Vodné a stočné Jabloňová 1a - období 28. 3. 2023 - 24. 4. 2023" },
           Balances: new List<DocumentBalance>
           {
                new DocumentBalance(
                    AccountedDate: new DateOnly(2023,1,1),
                    DocumentId: 100001,
                    SyntheticAccount: 231,
                    AnalyticAccount: 10,
                    Chapter: 0,
                    Paraghraph: 6310,
                    Item: 5163,
                    RecordUnit: 0,
                    PurposeMark: 0,
                    OrganizationUnit: 0,
                    Organization: 1610000000000u,
                    ShouldGive: 0.0m,
                    Gave: 20.0m,
                    Descriptions: new List<string>
                    {
                    }),
                new DocumentBalance(
                    AccountedDate: new DateOnly(2023,1,1),
                    DocumentId: 100001,
                    SyntheticAccount: 231,
                    AnalyticAccount: 10,
                    Chapter: 0,
                    Paraghraph: 6310,
                    Item: 5163,
                    RecordUnit: 0,
                    PurposeMark: 0,
                    OrganizationUnit: 0,
                    Organization: 1610000000000u,
                    ShouldGive: -42.73m,
                    Gave: 0,
                    Descriptions: new List<string>
                    {
                         "Zapojení nedočerpaných finančních prostředků z roku 2021 do výdajů roku 2022 na akci \"Prvky pro psí výběh\"",
                         "Nebytové hospodářství - převod finančních prostředků na pokrytí nákladů na detašované pracoviště Jabloňova 28"
                    })
               }
           );

        KxxDocument paymentDocument = new KxxDocument(
          DocumentType: DocumentType.ApprovedBudget,
          InputIdentifier: InputIdentifier.RewriteWithSameLicence,
          Ico: "4499278516",
          AccountingYear: 2023,
          AccountingMonth: 1,
          DocumentId: 100001,
          Descriptions: new Dictionary<string, string>
          {
                        { "OFJP", "Vlasák Petr" },
                        { "IC" , "66578434" },
                        { "DICT", "www.kavauvas.cz" }
          },
          EvkDescriptions: new Dictionary<string, string>
          {
                        { "KDF", "20231623100018" }
          },
          PlainTextDescriptions: new List<string>
          {
                      "Vodné a stočné Jabloňová 1a - období 28. 3. 2023 - 24. 4. 2023",
                      "Nebytové hospodářství - převod finančních prostředků na pokrytí nákladů na detašované pracoviště Jabloňova 28"
          },
          Balances: new List<DocumentBalance>
          {
                new DocumentBalance(
                    AccountedDate: new DateOnly(2023,1,1),
                    DocumentId: 100001,
                    SyntheticAccount: 231,
                    AnalyticAccount: 10,
                    Chapter: 0,
                    Paraghraph: 6310,
                    Item: 5163,
                    RecordUnit: 0,
                    PurposeMark: 0,
                    OrganizationUnit: 0,
                    Organization: 1610000000000u,
                    ShouldGive: 0.0m,
                    Gave: 27.60m,
                    Descriptions: new List<string>
                    {
                        "Zapojení nedočerpaných finančních prostředků z roku 2021 do výdajů roku 2022 na akci \"Prvky pro psí výběh\"",
                    }),
                new DocumentBalance(
                    AccountedDate: new DateOnly(2023,1,1),
                    DocumentId: 100001,
                    SyntheticAccount: 231,
                    AnalyticAccount: 10,
                    Chapter: 0,
                    Paraghraph: 6310,
                    Item: 5163,
                    RecordUnit: 0,
                    PurposeMark: 0,
                    OrganizationUnit: 0,
                    Organization: 1610000000000u,
                    ShouldGive: -42.73m,
                    Gave: 20,
                    Descriptions: new List<string>
                    {
                    })
              }
          );


        AccountingRecord expectedRecord1 = new(
            Type: AccountingRecordType.RozApproved,
            Paragraph: 6310,
            Item: 5163,
            Event: 1610000000000u,
            RecordUnit: 0,
            Amount: 62.60m);

        AccountingRecord expectedRecord2 = new(
            Type: AccountingRecordType.RozEdited,
            Paragraph: 6310,
            Item: 5163,
            Event: 1610000000000u,
            RecordUnit: 0,
            Amount: 62.73m);

        PaymentRecord expectedPayment1 = new(
           Type: PaymentRecordType.Kdf,
           AccountedDate: new DateOnly(2023, 1, 1),
           RecordId: "20231623100018",
           CounterpartyId: "66578434",
           CounterpartyName: "www.kavauvas.cz",
           Amount: 27.60m,
           Description: "Vodné a stočné Jabloňová 1a - období 28. 3. 2023 - 24. 4. 2023",
           Paragraph: 6310,
           Item: 5163,
           Event: 1610000000000u,
           RecordUnit: 0);

        PaymentRecord expectedPayment2 = new(
            Type: PaymentRecordType.Kdf,
            AccountedDate: new DateOnly(2023, 1, 1),
            RecordId: "20231623100018",
            CounterpartyId: "66578434",
            CounterpartyName: "www.kavauvas.cz",
            Amount: 62.73m,
            Description: "Vodné a stočné Jabloňová 1a - období 28. 3. 2023 - 24. 4. 2023",
            Paragraph: 6310,
            Item: 5163,
            Event: 1610000000000u,
            RecordUnit: 0);

        KxxRecordBuilder recordBuilder = _parserService.CreateRecordBuilder();
        AccountingAndPayments result = recordBuilder.BuildRecordsFromDocuments(new KxxDocument[] { document1, document2, paymentDocument });
        result.PaymentRecords.Should().BeEquivalentTo(new PaymentRecord[] { expectedPayment1, expectedPayment2 });
        result.AccountingRecords.Should().BeEquivalentTo(new[] { expectedRecord1, expectedRecord2 });
    }
}
