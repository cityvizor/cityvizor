using Cityvizor.Importer.Convertor.Kxx;
using Cityvizor.Importer.Convertor.Kxx.Dtos.Enums;
using Cityvizor.Importer.Convertor.Kxx.Dtos;
using Cityvizor.Importer.Convertor.Kxx.Helpers;
using Cityvizor.Importer.Convertor.Kxx.Enums;
using Microsoft.AspNetCore.Mvc.Testing;
using Cityvizor.Importer.Services;
using System.IO;

namespace Cityvizor.Importer.UnitTests;

public class KxxParserTests : WebTestBase
{
    public KxxParserTests(WebApplicationFactory<Program> factory): base(factory)
    {
        _parserService = GetRequiredService<KxxParserService>();
    }

    private readonly KxxParserService _parserService;

    [Fact]
    public void TestParsingWeirdDescriptions()
    {
        string input = @"5/@449927850009000MBMC
6/@449927850102 2 2023
G/@01   830041000311030400000000000000000000000000000000000000000000000000000000000481100 000000000000000000 
G/@01   830041000603030000000000000025000000000000000000000000000000000000000000000000000 000000000000481100 
G/@01   830041000797031100000000060100000000011100000000000000000000000000000000000481100 000000000000000000 
G/@01   830041000797060300000001000500000000000000000000000000000000111000000000000000000 000000000000481100 
G/#0001   830041*PDD-A;*ODPH-2022;*ECDD-16000448/17;*DICT-Vlasák Petr;*EVK-DDP-201316000448;
G/#0002   830041*EVKT-16DDP1602 - pronájmy zahrádek;*PID-MBMCX001RAK2;
G/#0003   830041*OFJP-Vlasák Petr;*OFMP-Žebìtínek 178/15, Brno, 62100, Èeská republika;*DZP-20220301;*DUD-20220301;
G/#0004   830041*DVD-20220301;*DEV-20220301;*OZP-A;*POP-N;*INR-N;*ECDDO-16000448/17;*DUDO-20220301;
";

        StreamReader reader = Utils.StreamReaderFromString(input);

        KxxParser parser = _parserService.CreateParser(reader);

        Document[] res = parser.Parse();
    }


    [Fact]
    public void TestParsingSimpleFile()
    {
        string input = @"5/@44992785160009000MBMC
6/@44992785160102 2 2023
G/@01   100001000231001000006310516300000000000000000000001610000000000000000000000000000 000000000000002760 
G/@01   100001000231001000006310516300000000000000000000001610000000000000000000000004273c000000000000002760-
G/$0001   100001Zapojení nedoèerpaných finanèních prostøedkù z roku 2021 do výdajù roku 2022 na akci ""Prvky pro psí výbìh""
G/#0001   100001*OFJP-Vlasák Petr;*OFMP-Žebìtínek 178/15, Brno, 62100, Èeská republika;*DZP-20220301;*DUD-20220301;
G/#0002   100001*PDD-A;*ODPH-2022;*ECDD-16000448/17;*DICT-Vlasák Petr;*EVK-DDP-201316000448;
6/@44992785160102 2 2023
G/@01   100001000231001000006310516300000000000000000000001610000000000000000000000000000 000000000000002760 
G/@01   100001000231001000006310516300000000000000000000001610000000000000000000000004273c000000000000002760-
G/$0001   100001Zapojení nedoèerpaných finanèních prostøedkù z roku 2021 do výdajù roku 2022 na akci ""Prvky pro psí výbìh""
G/#0001   100001*OFJP-Vlasák Petr;*OFMP-Žebìtínek 178/15, Brno, 62100, Èeská republika;*DZP-20220301;*DUD-20220301;
G/#0002   100001*PDD-A;*ODPH-2022;*ECDD-16000448/17;*DICT-Vlasák Petr;*EVK-DDP-201316000448;
";

        StreamReader reader = Utils.StreamReaderFromString(input);
        KxxParser parser = _parserService.CreateParser(reader);
        Document[] res = parser.Parse();

        Document expected = new Document(
            SectionType: SectionType.ApprovedBudget,
            InputIndetifier: InputIndetifier.RewriteWithSameLicence,
            Ico: "4499278516",
            AccountingYear: 2023,
            AccountingMonth: 1,
            DocumentId: 100001,
            Descriptions: new Dictionary<string, string>
            {
                { "OFJP", "Vlasák Petr" },
                { "OFMP", "Žebìtínek 178/15, Brno, 62100, Èeská republika" },
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
            Balances: new List<DocumentBalance>
            {
                new DocumentBalance(
                    AccountedDate: new DateOnly(2023,1,1),
                    DocumentId: 100001,
                    SynteticAccount: 231,
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
                    }),
                new DocumentBalance(
                    AccountedDate: new DateOnly(2023,1,1),
                    DocumentId: 100001,
                    SynteticAccount: 231,
                    AnalyticAccount: 10,
                    Chapter: 0,
                    Paraghraph: 6310,
                    Item: 5163,
                    RecordUnit: 0,
                    PurposeMark: 0,
                    OrganizationUnit: 0,
                    Organization: 1610000000000u,
                    ShouldGive: -42.73m,
                    Gave: -27.60m,
                    Descriptions: new List<string>
                    {
                         "Zapojení nedoèerpaných finanèních prostøedkù z roku 2021 do výdajù roku 2022 na akci \"Prvky pro psí výbìh\""
                    })
                }
            );

        res.Should().BeEquivalentTo(new Document[] { expected, expected });
    }

    [Fact]
    public void ParseHeaderTest()
    {
        string input = "5/@449927850009000MBMC";

        KxxFileHeader expected = new KxxFileHeader(
            Ico: "44992785",
            AccountingMonth: 9,
            ProgramLicence: "MBMC");

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        KxxFileHeader res = parser.ParseKxxFileHeader(input);

        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseHeaderLongerIcoTest()
    {
        string input = "5/@44992785160009000MBMC";

        KxxFileHeader expected = new KxxFileHeader(
            Ico: "4499278516",
            AccountingMonth: 9,
            ProgramLicence: "MBMC");

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        KxxFileHeader res = parser.ParseKxxFileHeader(input);

        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseHeaderFlawdIcoTest()
    {
        string input = "5/@1230009000MBMC";

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        var func = () => parser.ParseKxxFileHeader(input);

        func.Should().Throw<KxxParserException>();

        input = "5/@123456789120009000MBMC";

        parser = _parserService.CreateParser(StreamReader.Null);
        func = () => parser.ParseKxxFileHeader(input);

        func.Should().Throw<KxxParserException>();
    }

    [Fact]
    public void ParseDocumentHeaderTest()
    {
        string input = "6/@449927850102 2 2023";

        KxxSectionHeader expected = new KxxSectionHeader(
            Ico: "44992785",
            AccountingMonth: 1,
            SectionType: SectionType.ApprovedBudget,
            InputIndetifier: InputIndetifier.RewriteWithSameLicence,
            AccountingYear: 2023);

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        KxxSectionHeader res = parser.ParseKxxSectionHeader(input);

        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseDocumentHeaderMissingIdentifierTest()
    {
        string input = "6/@449927850102   2023";

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        var func = () => parser.ParseKxxSectionHeader(input);

        func.Should().Throw<KxxParserException>();
    }

    [Fact]
    public void ParseDocumentHeaderLongerIcoTest()
    {
        string input = "6/@44992785160102 2 2023";

        KxxSectionHeader expected = new KxxSectionHeader(
            Ico: "4499278516",
            AccountingMonth: 1,
            SectionType: SectionType.ApprovedBudget,
            InputIndetifier: InputIndetifier.RewriteWithSameLicence,
            AccountingYear: 2023);

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        KxxSectionHeader res = parser.ParseKxxSectionHeader(input);

        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseDocumentLineTest()
    {
        string input = "G/@01   100001000231001000006310516300000000000000000000001610000000000000000000000000000 000000000000002760 ";

        KxxDocumentBalance expected = new KxxDocumentBalance(
            AccountedDay: 1,
            DocumentId: 100001,
            SynteticAccount: 231,
            AnalyticAccount: 10,
            Chapter: 0,
            Paraghraph: 6310,
            Item: 5163,
            RecordUnit: 0,
            PurposeMark: 0,
            OrganizationUnit: 0,
            Organization: 1610000000000u,
            ShouldGive: 0.0m,
            Gave: 27.60m);

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        KxxDocumentBalance res = parser.ParseKxxDocumentBalance(input);

        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseDocumentLineNegativeTest()
    {
        string input = "G/@01   100001000231001000006310516300000000000000000000001610000000000000000000000004273c000000000000002760-";

        KxxDocumentBalance expected = new KxxDocumentBalance(
            AccountedDay: 1,
            DocumentId: 100001,
            SynteticAccount: 231,
            AnalyticAccount: 10,
            Chapter: 0,
            Paraghraph: 6310,
            Item: 5163,
            RecordUnit: 0,
            PurposeMark: 0,
            OrganizationUnit: 0,
            Organization: 1610000000000u,
            ShouldGive: -42.73m,
            Gave: -27.60m);

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        KxxDocumentBalance res = parser.ParseKxxDocumentBalance(input);

        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseDocumentLineDescriptionTest()
    {
        string input = "G/$0001   100003Zapojení nedoèerpaných finanèních prostøedkù z roku 2021 do výdajù roku 2022 na akci \"Prvky pro psí výbìh\"";

        KxxDocumentBalanceDescription expected = new KxxDocumentBalanceDescription(
            DocumentLineNumber: 1,
            DocumentId: 100003,
            BalanceDescription: "Zapojení nedoèerpaných finanèních prostøedkù z roku 2021 do výdajù roku 2022 na akci \"Prvky pro psí výbìh\"");

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        KxxDocumentBalanceDescription res = parser.ParseKxxDocumentBalanceDescription(input);

        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseDocumentLineDescriptionEmptyTest()
    {
        string input = "G/$0001   100003";

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        var func = () => parser.ParseKxxDocumentBalanceDescription(input);

        func.Should().Throw<KxxParserException>();
    }

    [Fact]
    public void ParseDocumentDescriptionTest()
    {
        string input = "G/#0003   830041*OFJP-Vlasák Petr;*OFMP-Žebìtínek 178/15, Brno, 62100, Èeská republika;*DZP-20220301;*DUD-20220301;";

        KxxDocumentDescription expected = new KxxDocumentDescription(
            DocumentLineNumber: 3,
            DocumentId: 830041,
            Descriptions: new Dictionary<string, string>
            {
                { "OFJP", "Vlasák Petr" },
                { "OFMP", "Žebìtínek 178/15, Brno, 62100, Èeská republika" },
                { "DZP", "20220301"},
                { "DUD", "20220301" },
            },
            EvkDescriptions: new Dictionary<string, string>()
        );

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        KxxDocumentDescription res = parser.ParseKxxDocumentDescription(input);
        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseDocumentDescriptionEvkTest()
    {
        string input = "G/#0001   830041*PDD-A;*ODPH-2022;*ECDD-16000448/17;*DICT-Vlasák Petr;*EVK-DDP-201316000448;";

        KxxDocumentDescription expected = new KxxDocumentDescription(
            DocumentLineNumber: 1,
            DocumentId: 830041,
            Descriptions: new Dictionary<string, string>
            {
                { "PDD", "A" },
                { "ODPH", "2022" },
                { "ECDD", "16000448/17" },
                { "DICT", "Vlasák Petr" }
            },
            EvkDescriptions: new Dictionary<string, string>
            {
                { "DDP", "201316000448" }
            }
        );

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        KxxDocumentDescription res = parser.ParseKxxDocumentDescription(input);
        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseDocumentDescriptionFlawedTest()
    {
        string input = "G/#0001   830041*PDD-A;*ODPH-2022;*ECDD-16000-448/17;*DICT-Vlasák Petr;*EVK-DDP-201316000448;";
        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        var func = () => parser.ParseKxxDocumentDescription(input);
        func.Should().Throw<KxxParserException>();
    }

    [Fact]
    public void DetermineLineTypeTest()
    {
        string input = "5/@44992785160009000MBMC";
        ParserHelpers.TryDetermineLineType(input, out var lineType);
        lineType.Should().Be(KxxLineType.FileHeader);

        input = "6/@44992785160102 2 2023";
        ParserHelpers.TryDetermineLineType(input, out lineType);
        lineType.Should().Be(KxxLineType.SectionHeader);

        input = "G/@01   100001000231001000006310516300000000000000000000001610000000000000000000000000000 000000000000002760 ";
        ParserHelpers.TryDetermineLineType(input, out lineType);
        lineType.Should().Be(KxxLineType.DocumentBalance);

        input = "G/$0001   100003Základní škola - zapojení investièního transferu na akci\"Projekt na Sportovištì a další prostory pro ZŠ Hudcova 35 a komunitní èinnost v Medlánkách\"";
        ParserHelpers.TryDetermineLineType(input, out lineType);
        lineType.Should().Be(KxxLineType.DocumentBalanceDescription);

        input = "G/#0001   830041*PDD-A;*ODPH-2022;*ECDD-16000448/17;*DICT-Vlasák Petr;*EVK-DDP-201316000448;";
        ParserHelpers.TryDetermineLineType(input, out lineType);
        lineType.Should().Be(KxxLineType.DocumentDescription);
    }
}