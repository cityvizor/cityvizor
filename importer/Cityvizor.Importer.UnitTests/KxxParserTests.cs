using Cityvizor.Importer.Convertor.Kxx;
using Cityvizor.Importer.Convertor.Kxx.Dtos.Enums;
using Cityvizor.Importer.Convertor.Kxx.Dtos;
using Cityvizor.Importer.Convertor.Kxx.Helpers;
using Cityvizor.Importer.Convertor.Kxx.Enums;

namespace Cityvizor.Importer.UnitTests;

public class KxxParserTests
{
    [Fact]
    public void ParseHeaderTest()
    {
        string input = "5/@449927850009000MBMC";

        KxxFileHeader expected = new KxxFileHeader(
            Ico: "44992785",
            AccountingMonth: 9,
            ProgramLicence: "MBMC");

        KxxParser parser = new(StreamReader.Null);
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

        KxxParser parser = new(StreamReader.Null);
        KxxFileHeader res = parser.ParseKxxFileHeader(input);

        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseHeaderFlawdIcoTest()
    {
        string input = "5/@1230009000MBMC";

        KxxParser parser = new(StreamReader.Null);
        var func = () => parser.ParseKxxFileHeader(input);

        func.Should().Throw<KxxParserException>();

        input = "5/@123456789120009000MBMC";

        parser = new(StreamReader.Null);
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

        KxxParser parser = new(StreamReader.Null);
        KxxSectionHeader res = parser.ParseKxxSectionHeader(input);

        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseDocumentHeaderMissingIdentifierTest()
    {
        string input = "6/@449927850102   2023";

        KxxParser parser = new(StreamReader.Null);
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

        KxxParser parser = new(StreamReader.Null);
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

        KxxParser parser = new(StreamReader.Null);
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

        KxxParser parser = new(StreamReader.Null);
        KxxDocumentBalance res = parser.ParseKxxDocumentBalance(input);

        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseDocumentLineDescriptionTest()
    {
        string input = "G/$0001   100003Zapojení nedoèerpaných finanèních prostøedkù z roku 2021 do výdajù roku 2022 na akci \"Prvky pro psí výbìh\"";

        KxxDocumentBalanceDescription expected = new KxxDocumentBalanceDescription(
            DocumentLineNumber: 1,
            DocumentNumber: 100003,
            LineDescription: "Zapojení nedoèerpaných finanèních prostøedkù z roku 2021 do výdajù roku 2022 na akci \"Prvky pro psí výbìh\"");

        KxxParser parser = new(StreamReader.Null);
        KxxDocumentBalanceDescription res = parser.ParseKxxDocumentBalanceDescription(input);

        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseDocumentLineDescriptionEmptyTest()
    {
        string input = "G/$0001   100003";

        KxxParser parser = new(StreamReader.Null);
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

        KxxParser parser = new(StreamReader.Null);
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

        KxxParser parser = new(StreamReader.Null);
        KxxDocumentDescription res = parser.ParseKxxDocumentDescription(input);
        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseDocumentDescriptionFlawedTest()
    {
        string input = "G/#0001   830041*PDD-A;*ODPH-2022;*ECDD-16000-448/17;*DICT-Vlasák Petr;*EVK-DDP-201316000448;";
        KxxParser parser = new(StreamReader.Null);
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