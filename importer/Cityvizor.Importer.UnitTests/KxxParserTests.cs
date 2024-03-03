using Cityvizor.Importer.Converter.Kxx;
using Cityvizor.Importer.Converter.Kxx.Dtos.Enums;
using Cityvizor.Importer.Converter.Kxx.Dtos;
using Cityvizor.Importer.Converter.Kxx.Helpers;
using Cityvizor.Importer.Converter.Kxx.Enums;
using Microsoft.AspNetCore.Mvc.Testing;
using Cityvizor.Importer.Services;
using System.IO;
using Cityvizor.Importer.Converter.Kxx.Abstractions;

namespace Cityvizor.Importer.UnitTests;

public class KxxParserTests : WebTestBase
{
    public KxxParserTests(WebApplicationFactory<Program> factory): base(factory)
    {
        _parserService = GetRequiredService<IKxxConverterService>();
    }

    private readonly IKxxConverterService _parserService;

    [Fact]
    public void TestParsingUcto()
    {
        StreamReader reader = Utils.StreamReaderFromKxxTestingDataTestFile("ucto_medl_hc.kxx");
        KxxParser parser = _parserService.CreateParser(reader);
        KxxDocument[] res = parser.Parse();
    }

    [Fact]
    public void TestParsingRozp()
    {
        StreamReader reader = Utils.StreamReaderFromKxxTestingDataTestFile("rozp_medl_hc.kxx");
        KxxParser parser = _parserService.CreateParser(reader);
        KxxDocument[] res = parser.Parse();
    }

    [Fact]
    public void TestParsingWeirdDescriptions()
    {
        string input = @"5/@449927850009000MBMC
6/@449927850102 2 2023
G/@01   830041000311030400000000000000000000000000000000000000000000000000000000000481100 000000000000000000 
G/@01   830041000603030000000000000025000000000000000000000000000000000000000000000000000 000000000000481100 
G/@01   830041000797031100000000060100000000011100000000000000000000000000000000000481100 000000000000000000 
G/@01   830041000797060300000001000500000000000000000000000000000000111000000000000000000 000000000000481100 
G/#0001   830041*PDD-A;*ODPH-2022;*ECDD-16000448/17;*DICT-Vlas�k Petr;*EVK-DDP-201316000448;
G/#0002   830041*EVKT-16DDP1602 - pron�jmy zahr�dek;*PID-MBMCX001RAK2;
G/#0003   830041*OFJP-Vlas�k Petr;*OFMP-�eb�t�nek 178/15, Brno, 62100, �esk� republika;*DZP-20220301;*DUD-20220301;
G/#0004   830041*DVD-20220301;*DEV-20220301;*OZP-A;*POP-N;*INR-N;*ECDDO-16000448/17;*DUDO-20220301;
";

        StreamReader reader = Utils.StreamReaderFromString(input);

        KxxParser parser = _parserService.CreateParser(reader);

        KxxDocument[] res = parser.Parse();
    }


    [Fact]
    public void TestParsingSimpleFile()
    {
        string input = @"5/@44992785160009000MBMC
6/@44992785160102 2 2023
G/@01   100001000231001000006310516300000000000000000000001610000000000000000000000000000 000000000000002760 
G/@01   100001000231001000006310516300000000000000000000001610000000000000000000000004273c000000000000002760-
G/$0001   100001Zapojen� nedo�erpan�ch finan�n�ch prost�edk� z roku 2021 do v�daj� roku 2022 na akci ""Prvky pro ps� v�b�h""
G/#0001   100001*OFJP-Vlas�k Petr;*OFMP-�eb�t�nek 178/15, Brno, 62100, �esk� republika;*DZP-20220301;*DUD-20220301;
G/#0002   100001*PDD-A;*ODPH-2022;*ECDD-16000448/17;*DICT-Vlas�k Petr;*EVK-DDP-201316000448;
G/#0003   100001Vodn� a sto�n� Jablo�ov� 1a - obdob� 28. 3. 2023 - 24. 4. 2023
6/@44992785160102 2 2023
G/@01   100001000231001000006310516300000000000000000000001610000000000000000000000000000 000000000000002760 
G/@01   100001000231001000006310516300000000000000000000001610000000000000000000000004273c000000000000002760-
G/$0001   100001Zapojen� nedo�erpan�ch finan�n�ch prost�edk� z roku 2021 do v�daj� roku 2022 na akci ""Prvky pro ps� v�b�h""
G/#0001   100001*OFJP-Vlas�k Petr;*OFMP-�eb�t�nek 178/15, Brno, 62100, �esk� republika;*DZP-20220301;*DUD-20220301;
G/#0002   100001*PDD-A;*ODPH-2022;*ECDD-16000448/17;*DICT-Vlas�k Petr;*EVK-DDP-201316000448;
G/#0003   100001Vodn� a sto�n� Jablo�ov� 1a - obdob� 28. 3. 2023 - 24. 4. 2023
";

        StreamReader reader = Utils.StreamReaderFromString(input);
        KxxParser parser = _parserService.CreateParser(reader);
        KxxDocument[] res = parser.Parse();

        KxxDocument expected = new KxxDocument(
            DocumentType: DocumentType.ApprovedBudget,
            InputIdentifier: InputIdentifier.RewriteWithSameLicence,
            Ico: "4499278516",
            AccountingYear: 2023,
            AccountingMonth: 1,
            DocumentId: 100001,
            Descriptions: new Dictionary<string, string>
            {
                { "OFJP", "Vlas�k Petr" },
                { "OFMP", "�eb�t�nek 178/15, Brno, 62100, �esk� republika" },
                { "DZP", "20220301"},
                { "DUD", "20220301" },
                { "PDD", "A" },
                { "ODPH", "2022" },
                { "ECDD", "16000448/17" },
                { "DICT", "Vlas�k Petr" }
            },
            EvkDescriptions: new Dictionary<string, string>
            {
                { "DDP", "201316000448" }
            },
            PlainTextDescriptions: new List<string> { "Vodn� a sto�n� Jablo�ov� 1a - obdob� 28. 3. 2023 - 24. 4. 2023" },
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
                    Gave: -27.60m,
                    Descriptions: new List<string>
                    {
                         "Zapojen� nedo�erpan�ch finan�n�ch prost�edk� z roku 2021 do v�daj� roku 2022 na akci \"Prvky pro ps� v�b�h\""
                    })
                }
            );

        res.Should().BeEquivalentTo(new KxxDocument[] { expected, expected });
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
            SectionType: DocumentType.ApprovedBudget,
            InputIndetifier: InputIdentifier.RewriteWithSameLicence,
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
            SectionType: DocumentType.ApprovedBudget,
            InputIndetifier: InputIdentifier.RewriteWithSameLicence,
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
            Gave: -27.60m);

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        KxxDocumentBalance res = parser.ParseKxxDocumentBalance(input);

        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseDocumentLineDescriptionTest()
    {
        string input = "G/$0001   100003Zapojen� nedo�erpan�ch finan�n�ch prost�edk� z roku 2021 do v�daj� roku 2022 na akci \"Prvky pro ps� v�b�h\"";

        KxxDocumentBalanceDescription expected = new KxxDocumentBalanceDescription(
            DocumentLineNumber: 1,
            DocumentId: 100003,
            BalanceDescription: "Zapojen� nedo�erpan�ch finan�n�ch prost�edk� z roku 2021 do v�daj� roku 2022 na akci \"Prvky pro ps� v�b�h\"");

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
        string input = "G/#0003   830041*OFJP-Vlas�k Petr;*OFMP-�eb�t�nek 178/15, Brno, 62100, �esk� republika;*DZP-20220301;*DUD-20220301;";

        KxxDocumentDescription expected = new KxxDocumentDescription(
            DocumentLineNumber: 3,
            DocumentId: 830041,
            Descriptions: new Dictionary<string, string>
            {
                { "OFJP", "Vlas�k Petr" },
                { "OFMP", "�eb�t�nek 178/15, Brno, 62100, �esk� republika" },
                { "DZP", "20220301"},
                { "DUD", "20220301" },
            },
            EvkDescriptions: new Dictionary<string, string>(),
            PlainTextDescription: Array.Empty<string>()
        );

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        KxxDocumentDescription res = parser.ParseKxxDocumentDescription(input);
        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseDocumentDescriptionEvkTest()
    {
        string input = "G/#0001   830041*PDD-A;*ODPH-2022;*ECDD-16000448/17;*DICT-Vlas�k Petr;*EVK-DDP-201316000448;";

        KxxDocumentDescription expected = new KxxDocumentDescription(
            DocumentLineNumber: 1,
            DocumentId: 830041,
            Descriptions: new Dictionary<string, string>
            {
                { "PDD", "A" },
                { "ODPH", "2022" },
                { "ECDD", "16000448/17" },
                { "DICT", "Vlas�k Petr" }
            },
            EvkDescriptions: new Dictionary<string, string>
            {
                { "DDP", "201316000448" }
            },
            PlainTextDescription: Array.Empty<string>()
        );

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        KxxDocumentDescription res = parser.ParseKxxDocumentDescription(input);
        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseDocumentDescriptionPlainTextDescriptionTest()
    {
        string input = "G/#0001   350037Obcane pro Medlanky-Obcane pro Medlanky Najemne Pr";

        KxxDocumentDescription expected = new KxxDocumentDescription(
            DocumentLineNumber: 1,
            DocumentId: 350037,
            Descriptions: new Dictionary<string, string>(),
            EvkDescriptions: new Dictionary<string, string>(),
            PlainTextDescription: new string[] { "Obcane pro Medlanky-Obcane pro Medlanky Najemne Pr" }
        );

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        KxxDocumentDescription res = parser.ParseKxxDocumentDescription(input);
        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseDocumentDescriptionSemicolonsInPlainText()
    {
        string input = "G/#0002   700012*EVKT-16 - Hlavn�:Drobn� mateir�l;  Vina�sk� pot�eby;*PID-MBMCX00QBH7H;";

        KxxDocumentDescription expected = new KxxDocumentDescription(
            DocumentLineNumber: 2,
            DocumentId: 700012,
            Descriptions: new Dictionary<string, string>()
            {
                { "EVKT", "16 - Hlavn�:Drobn� mateir�l;  Vina�sk� pot�eby"},
                { "PID", "MBMCX00QBH7H"}
            },
            EvkDescriptions: new Dictionary<string, string>(),
            PlainTextDescription: Array.Empty<string>()
        );

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        KxxDocumentDescription res = parser.ParseKxxDocumentDescription(input);
        res.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ParseDocumentDescriptionPlaintextLineWithStars()
    {
        string input = "G/#0001   320006V� - veden� platebn� karty\\nV�dej : 390,00 K�\\nV�pis �. 59 z 09.05.2023 �.�. 18628621/0100, VS = 10526245, SS = 202180001\\nLikvidace : Bo�eck� Jana Popis : PRIME VISA - PLATEBNI KARTY CZ-00105262 PLATEBNI KARTY Annual Fee 18 4125 01** **** 1128 VISA";

        KxxDocumentDescription expected = new KxxDocumentDescription(
            DocumentLineNumber: 1,
            DocumentId: 320006,
            Descriptions: new Dictionary<string, string>(),
            EvkDescriptions: new Dictionary<string, string>(),
            PlainTextDescription: new string[] { "V� - veden� platebn� karty\\nV�dej : 390,00 K�\\nV�pis �. 59 z 09.05.2023 �.�. 18628621/0100, VS = 10526245, SS = 202180001\\nLikvidace : Bo�eck� Jana Popis : PRIME VISA - PLATEBNI KARTY CZ-00105262 PLATEBNI KARTY Annual Fee 18 4125 01** **** 1128 VISA" }
        );

        KxxParser parser = _parserService.CreateParser(StreamReader.Null);
        KxxDocumentDescription res = parser.ParseKxxDocumentDescription(input);
        res.Should().BeEquivalentTo(expected);
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

        input = "G/$0001   100003Z�kladn� �kola - zapojen� investi�n�ho transferu na akci\"Projekt na Sportovi�t� a dal�� prostory pro Z� Hudcova 35 a komunitn� �innost v Medl�nk�ch\"";
        ParserHelpers.TryDetermineLineType(input, out lineType);
        lineType.Should().Be(KxxLineType.DocumentBalanceDescription);

        input = "G/#0001   830041*PDD-A;*ODPH-2022;*ECDD-16000448/17;*DICT-Vlas�k Petr;*EVK-DDP-201316000448;";
        ParserHelpers.TryDetermineLineType(input, out lineType);
        lineType.Should().Be(KxxLineType.DocumentDescription);
    }
}