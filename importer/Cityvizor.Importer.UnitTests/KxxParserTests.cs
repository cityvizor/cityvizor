using Cityvizor.Importer.Convertor.Kxx;
using Cityvizor.Importer.Convertor.Kxx.Dtos;
using Cityvizor.Importer.Convertor.Kxx.Enums;
using System;

namespace Cityvizor.Importer.UnitTests;

public class KxxParserTests
{
    [Fact]
    public void ParseHeaderTest()
    {
        string input = "5/@449927850009000MBMC";

        KxxHeader expected = new KxxHeader(
            Ico: "44992785",
            Month: 9,
            ProgramLicence: "MBMC");

        KxxParser parser = new();
        KxxHeader res = parser.ParseKxxHeader(input);

        res.Should().Be(expected);
    }

    [Fact]
    public void ParseHeaderLongerIcoTest()
    {
        string input = "5/@44992785160009000MBMC";

        KxxHeader expected = new KxxHeader(
            Ico: "4499278516",
            Month: 9,
            ProgramLicence: "MBMC");

        KxxParser parser = new();
        KxxHeader res = parser.ParseKxxHeader(input);

        res.Should().Be(expected);
    }

    [Fact]
    public void ParseHeaderFlawdIcoTest()
    {
        string input = "5/@1230009000MBMC";

        KxxParser parser = new();
        var func = () => parser.ParseKxxHeader(input);

        func.Should().Throw<KxxParserException>();

        input = "5/@123456789120009000MBMC";

        parser = new();
        func = () => parser.ParseKxxHeader(input);

        func.Should().Throw<KxxParserException>();
    }

    [Fact]
    public void ParseDocumentHeaderTest()
    {
        string input = "6/@449927850102 2 2023";

        KxxDocumentBlockHeader expected = new KxxDocumentBlockHeader(
            Ico: "44992785",
            Month: 1,
            DocumentType: DocumentType.ApprovedBudget,
            InputIndetifier: InputIndetifier.RewriteWithSameLicence,
            AccountingYear: 2023);

        KxxParser parser = new();
        KxxDocumentBlockHeader res = parser.ParseKxxDocumentBlockHeader(input);

        res.Should().Be(expected);
    }

    [Fact]
    public void ParseDocumentHeaderMissingIdentifierTest()
    {
        string input = "6/@449927850102   2023";

        KxxParser parser = new();
        var func = () => parser.ParseKxxDocumentBlockHeader(input);

        func.Should().Throw<KxxParserException>();
    }

    [Fact]
    public void ParseDocumentHeaderLongerIcoTest()
    {
        string input = "6/@44992785160102 2 2023";

        KxxDocumentBlockHeader expected = new KxxDocumentBlockHeader(
            Ico: "4499278516",
            Month: 1,
            DocumentType: DocumentType.ApprovedBudget,
            InputIndetifier: InputIndetifier.RewriteWithSameLicence,
            AccountingYear: 2023);

        KxxParser parser = new();
        KxxDocumentBlockHeader res = parser.ParseKxxDocumentBlockHeader(input);

        res.Should().Be(expected);
    }

    [Fact]
    public void ParseDocumentLineTest()
    {
        string input = "G/@01   100001000231001000006310516300000000000000000000001610000000000000000000000000000 000000000000002760 ";

        KxxDocumentLine expected = new KxxDocumentLine(
            AccountedDay: 1,
            DocumentNumber: 100001,
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

        KxxParser parser = new();
        KxxDocumentLine res = parser.ParseKxxDocumentLine(input);

        res.Should().Be(expected);
    }

    [Fact]
    public void ParseDocumentLineNegativeTest()
    {
        string input = "G/@01   100001000231001000006310516300000000000000000000001610000000000000000000000004273c000000000000002760-";

        KxxDocumentLine expected = new KxxDocumentLine(
            AccountedDay: 1,
            DocumentNumber: 100001,
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

        KxxParser parser = new();
        KxxDocumentLine res = parser.ParseKxxDocumentLine(input);

        res.Should().Be(expected);
    }

    [Fact]
    public void ParseDocumentLineDescriptionTest()
    {
        string input = "G/$0001   100003Zapojení nedoèerpaných finanèních prostøedkù z roku 2021 do výdajù roku 2022 na akci \"Prvky pro psí výbìh\"";

        KxxDocumentLineDescription expected = new KxxDocumentLineDescription(
            DocumentLineNumber: 1,
            DocumentNumber: 100003,
            LineDescription: "Zapojení nedoèerpaných finanèních prostøedkù z roku 2021 do výdajù roku 2022 na akci \"Prvky pro psí výbìh\"");

        KxxParser parser = new();
        KxxDocumentLineDescription res = parser.ParseKxxDocumentLineDescription(input);

        res.Should().Be(expected);
    }

    [Fact]
    public void ParseDocumentLineDescriptionEmptyTest()
    {
        string input = "G/$0001   100003";

        KxxParser parser = new();
        var func = () => parser.ParseKxxDocumentLineDescription(input);

        func.Should().Throw<KxxParserException>();
    }
}