// This migration is not correct; contains shortened names, and it insert new items as 'paragraphs'.
const data = [
  {
    id: "1111",
    name: "Daň z příjmů fyzických osob placená plátci",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1112",
    name: "Daň z příjmů fyzických osob placená poplatníky",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1113",
    name: "Daň z příjmů fyzických osob vybíraná srážkou",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1119",
    name: "Zrušené daně, jejichž předmětem je příjem fyzických osob",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1121",
    name: "Daň z příjmů právnických osob",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1122",
    name: "Daň z příjmů právnických osob za obce",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1123",
    name: "Daň z příjmů právnických osob za kraje",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1129",
    name: "Zrušené daně, jejichž předmětem je příjem právnických osob",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1211",
    name: "Daň z přidané hodnoty",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1219",
    name: "Zrušené daně ze zboží a služeb",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1221",
    name: "Spotřební daň z minerálních olejů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1222",
    name: "Spotřební daň z lihu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1223",
    name: "Spotřební daň z piva",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1224",
    name: "Spotřební daň z vína a meziproduktů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1225",
    name: "Spotřební daň z tabákových výrobků",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1226",
    name: "Poplatek za látky poškozující nebo ohrožující ozónovou vrstv",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1227",
    name: "Audiovizuální poplatky",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1228",
    name: "Spotřební daň ze surového tabáku",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1229",
    name: "Spotřební daň ze zahřívaných tabákových výrobků",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1231",
    name: "Daň ze zemního plynu a některých dalších plynů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1232",
    name: "Daň z pevných paliv",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1233",
    name: "Daň z elektřiny",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1234",
    name: "Odvod z elektřiny ze slunečního záření",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1235",
    name: "Daň z digitálních služeb",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "1321", name: "Daň silniční", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "1322",
    name: "Poplatek za užívání dálnic a rychlostních silnic",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1331",
    name: "Poplatek za vypouštění odpadních vod do vod povrchových",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1332",
    name: "Poplatky za znečišťování ovzduší",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1333",
    name: "Poplatky za uložení odpadů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1334",
    name: "Odvody za odnětí půdy ze zemědělského půdního fondu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1335",
    name: "Poplatky za odnětí pozemků plnění funkcí lesa",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1336",
    name: "Poplatek za povolené vypouštění odpadních vod do vod podzemn",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1337",
    name: "Poplatek za komunální odpad",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1338",
    name: "Registrační a evidenční poplatky za obaly",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1339",
    name: "Ostatní poplatky a odvody v oblasti životního prostředí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1340",
    name: "Poplatek za provoz systému odpadů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1341",
    name: "Poplatek ze psů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1342",
    name: "Poplatek z pobytu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1343",
    name: "Poplatek za užívání veřejného prostranství",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1344",
    name: "Poplatek ze vstupného",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1346",
    name: "Poplatek za povolení k vjezdu do vybraných míst",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1348",
    name: "Poplatek za zhodnocení stavebního pozemku",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1349",
    name: "Zrušené místní poplatky",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1353",
    name: "Příjmy za zkoušky z odborné způsobilosti od žadatelů o řidič",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1354",
    name: "Příjmy z licencí pro kamionovou dopravu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1356",
    name: "Příjmy úhrad za dobývání nerostů a popl. za geolog. práce",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1357",
    name: "Poplatek za odebrané množství podzemní vody",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1358",
    name: "Poplatek za využívání zdroje přírodní minerální vody",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1359",
    name: "Ostatní odvody z vybraných činností a služeb jinde neuvedené",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1361",
    name: "Správní poplatky",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1362",
    name: "Soudní poplatky",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1371",
    name: "Poplatek na činnost Energetického regulačního úřadu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1372",
    name: "Poplatek SÚJB za žádost o vydání povolení",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1373",
    name: "Udržovací poplatek Státnímu úřadu pro jadernou bezpečnost",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1379",
    name: "Ostatní poplatky na činnost správních úřadů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1381",
    name: "Daň z hazardních her s výjimkou dílčí daně z technických her",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1382",
    name: "Zrušený odvod z loterií a podob. her kromě z výher. hr. př.",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1383",
    name: "Zrušený odvod z výherních hracích přístrojů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1384",
    name: "Zrušený odvod za státní dozor",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1385",
    name: "Dílčí daň z technických her",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "1401", name: "Clo", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "1409",
    name: "Zrušené daně z mezinárodního obchodu a transakcí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1511",
    name: "Daň z nemovitých věcí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "1521", name: "Daň dědická", validFrom: "1900-01-01T00:00:00.000Z" },
  { id: "1522", name: "Daň darovací", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "1523",
    name: "Daň z nabytí nemovitých věcí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1529",
    name: "Zrušené daně z majetkových a kapitálových převodů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1611",
    name: "Pojistné na důchodové pojištění od zaměstnavatelů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1612",
    name: "Pojistné na důchodové pojištění od zaměstnanců",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1613",
    name: "Pojistné na důchodové pojištění od osob samostatně výdělečně",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1614",
    name: "Pojistné na nemocenské pojištění od zaměstnavatelů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1615",
    name: "Pojistné na nemocenské pojištění od zaměstnanců",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1617",
    name: "Příspěvky na státní politiku zaměstnanosti od zaměstnavatelů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1618",
    name: "Příspěvky na státní politiku zaměstnanosti od zaměstnanců",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1621",
    name: "Příspěvky na státní politiku zaměstnanosti od OSVČ",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1627",
    name: "Přirážky k pojistnému",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1628",
    name: "Příslušenství pojistného",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1629",
    name: "Nevyjasněné, neidentifikované a nezařazené příjmy z pojistné",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1631",
    name: "Pojistné na veřejné zdravotní pojištění od zaměstnavatelů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1632",
    name: "Pojistné na veřejné zdravotní pojištění od zaměstnanců",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1633",
    name: "Pojistné na veřejné zdravotní pojištění od OSVČ",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1638",
    name: "Příslušenství pojistného na veřejné zdravotní pojištění",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1691",
    name: "Zrušené daně a odvody  z objemu mezd",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1701",
    name: "Nerozúčtované, neidentifikované a nezařaditelné daňové příjm",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1702",
    name: "Tržby z prodeje kolků",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "1703",
    name: "Odvody nahrazující zaměstnávání občanů se změněnou pracovní",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "1704", name: "Příslušenství", validFrom: "1900-01-01T00:00:00.000Z" },
  { id: "1706", name: "Dávky z cukru", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "2111",
    name: "Příjmy z poskytování služeb a výrobků",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2112",
    name: "Příjmy z prodeje zboží (již nakoupeného za účelem prodeje)",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2113",
    name: "Příjmy ze školného",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "2114", name: "Mýtné", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "2119",
    name: "Ostatní příjmy z vlastní činnosti",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2121",
    name: "Odvody přebytků ústřední banky",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2122",
    name: "Odvody příspěvkových organizací",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2123",
    name: "Ostatní odvody příspěvkových organizací",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2124",
    name: "Odvody školských právnických osob zřízených státem, kraji a",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2125",
    name: "Převody z fondů státních podniků do státního rozpočtu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2129",
    name: "Ostatní odvody přebytků organizací s přímým vztahem",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2131",
    name: "Příjmy z pronájmu pozemků",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2132",
    name: "Příjmy z pronájmu ostatních nemovitých věcí a jejich částí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2133",
    name: "Příjmy z pronájmu movitých věcí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2139",
    name: "Ostatní příjmy z pronájmu majetku",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2140",
    name: "Neúrokové př. z finanč. derivátů kromě k vlastním dluhopisům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2141",
    name: "Příjmy z úroků (část)",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2142",
    name: "Příjmy z podílů na zisku a dividend",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2143",
    name: "Kursové rozdíly v příjmech",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2144",
    name: "Příjmy z úroků ze státních dluhopisů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2145",
    name: "Příjmy z úroků z komunálních dluhopisů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2146",
    name: "Úrokové příjmy z finančních derivátů k vlastním dluhopisům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2147",
    name: "Neúrokové příjmy z finančních derivátů k vlastním dluhopisům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2148",
    name: "Úrokové příjmy z finančních derivátů kromě k vlastním dluhop",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2149",
    name: "Ostatní příjmy z výnosů finančního majetku",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2211",
    name: "Sankční platby přijaté od státu, obcí a krajů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2212",
    name: "Sankční platby přijaté od jiných subjektů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2221",
    name: "Přijaté vratky transferů od jiných veřejných rozpočtů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2222",
    name: "Ostatní příjmy z finančního vypořádání předchozích let od ji",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2223",
    name: "Příjmy z finančního vypořádání minulých let mezi krajem a ob",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2224",
    name: "Vratky nevyužitých prostředků z Národního fondu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2225",
    name: "Úhrady prostředků vynaložených podle zákona o ochraně zaměst",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2226",
    name: "Příjmy z finančního vypořádání minulých let mezi obcemi",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2227",
    name: "Příjmy z finančního vypořádání minulých let mezi regionální",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2229",
    name: "Ostatní přijaté vratky transferů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2310",
    name: "Příjmy z prodeje krátkodobého a drobného dlouhodobého majetk",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2321",
    name: "Přijaté neinvestiční dary",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2322",
    name: "Přijaté pojistné náhrady",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2324",
    name: "Přijaté nekapitálové příspěvky a náhrady",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2325",
    name: "Vratky prostředků z Národního fondu pro vyrovnání kursových",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2326",
    name: "Prostředky přijaté z NF - neplnění závazků z mezinár. smluv",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2327",
    name: "Úhrada prostředků, které státní rozpočet odvedl EU za NF",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2328",
    name: "Neidentifikované příjmy",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2329",
    name: "Ostatní nedaňové příjmy jinde nezařazené",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2342",
    name: "Platba k úhradě správy vodních toků a správy povodí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2343",
    name: "Příjmy dobíhaj. úhrad z dobýv. prostoru a z vydobyt. ner.",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2351",
    name: "Poplatky za udržování patentu v platnosti",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2352",
    name: "Poplatky za udržování evropského patentu v platnosti",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2353",
    name: "Poplatky za udržování dodatkového ochranného osvědčení pro l",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2361",
    name: "Pojistné na nemocenské pojištění od OSVČ",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2362",
    name: "Dobrovolné pojistné na důchodové pojištění",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2391",
    name: "Dočasné zatřídění příjmů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2411",
    name: "Splátky půjčených prostředků od podnikatelských subjektů-fyz",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2412",
    name: "Splátky půjčených prostředků od podnikatelských subjektů-prá",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2413",
    name: "Splátky půjčených prostředků od podnikatelských finančních s",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2414",
    name: "Splátky půjčených prostředků od podniků ve vlastnictví státu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2420",
    name: "Splátky půjčených prostředků od obecně prospěšných společnos",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2431",
    name: "Splátky půjčených prostředků od státního rozpočtu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2432",
    name: "Splátky půjčených prostředků  od státních fondů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2433",
    name: "Splátky půjčených prostředků od zvláštních fondů ústřední úr",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2434",
    name: "Splátky půjčených prostředků  od fondů sociálního a zdravotn",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2439",
    name: "Ostatní splátky půjčených prostředků od veřejných rozpočtů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2441",
    name: "Splátky půjčených prostředků od obcí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2442",
    name: "Splátky půjčených prostředků od krajů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2443",
    name: "Splátky půjčených prostředků od regionálních rad",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2449",
    name: "Ostatní splátky půjčených prostředků od veřejných rozpočtů ú",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2451",
    name: "Splátky půjčených prostředků od příspěvkových organizací",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2452",
    name: "Splátky půjčených prostředků od vysokých škol",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2459",
    name: "Splátky půjčených prostředků od ostatních zřízených a podobn",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2460",
    name: "Splátky půjčených prostředků od obyvatelstva",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2470",
    name: "Splátky půjčených prostředků ze zahraničí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2481",
    name: "Příjmy od dlužníků za realizace záruk",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2482",
    name: "Splátky od dlužníků za zaplacení dodávek",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "2511", name: "Podíl na clech", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "2512",
    name: "Podíl na dávkách z cukru",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "2513",
    name: "Podíl na DPH z telekom. a pod. služeb spravované pro EU",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "3111",
    name: "Příjmy z prodeje pozemků",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "3112",
    name: "Příjmy z prodeje ostatních nemovitých věcí a jejich částí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "3113",
    name: "Příjmy z prodeje ostatního hmotného dlouhodobého majetku",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "3114",
    name: "Příjmy z prodeje nehmotného dlouhodobého majetku",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "3119",
    name: "Ostatní příjmy z prodeje dlouhodobého majetku",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "3121",
    name: "Přijaté dary na pořízení dlouhodobého majetku",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "3122",
    name: "Přijaté příspěvky na pořízení dlouhodobého majetku",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "3129",
    name: "Ostatní investiční příjmy jinde nezařazené",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "3201",
    name: "Příjmy z prodeje akcií",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "3202",
    name: "Příjmy z prodeje majetkových podílů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "3203",
    name: "Příjmy z prodeje dluhopisů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "3209",
    name: "Ostatní příjmy z prodeje dlouhodobého finančního majetku",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4111",
    name: "Neinvestiční přijaté transfery z všeobecné pokladní správy s",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4112",
    name: "Neinvestiční přijaté transfery ze státního rozpočtu v rámci",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4113",
    name: "Neinvestiční přijaté transfery ze státních fondů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4114",
    name: "Neinvestiční přijaté transfery ze zvláštních fondů ústřední",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4115",
    name: "Neinvestiční přijaté transfery od fondů sociálního a zdravot",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4116",
    name: "Ostatní neinvestiční přijaté transfery ze státního rozpočtu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4118",
    name: "Neinvestiční převody z Národního fondu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4119",
    name: "Ostatní neinvestiční přijaté transfery od rozpočtů ústřední",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4121",
    name: "Neinvestiční přijaté transfery od obcí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4122",
    name: "Neinvestiční přijaté transfery od krajů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4123",
    name: "Neinvestiční přijaté transfery od regionálních rad",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4129",
    name: "Ostatní neinvestiční přijaté transfery od rozpočtů územní úr",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4131",
    name: "Převody z vlastních fondů hospodářské (podnikatelské) činnos",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4132",
    name: "Převody z ostatních vlastních fondů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4133",
    name: "Převody z vlastních rezervních fondů (jiných než organizační",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4134",
    name: "Převody z rozpočtových účtů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4135",
    name: "Převody z rezervních fondů organizačních složek státu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4136",
    name: "Převody z jiných fondů organizačních složek státu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4137",
    name: "Neinv.převody-statutární města (Praha) a obvody/části-příjmy",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4138",
    name: "Převody z vlastní pokladny",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4139",
    name: "Ostatní převody z vlastních fondů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4140",
    name: "Převody z vlastních fondů přes rok",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4151",
    name: "Neinvestiční přijaté transfery od cizích států",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4152",
    name: "Neinv. př. transf. od mez. inst. a někt. ciz.org. a práv.os.",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4153",
    name: "Neinvestiční transfery přijaté od Evropské unie",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4155",
    name: "Neinvestiční transfery z finančních mechanismů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4156",
    name: "Neinvestiční transfery od NATO",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4159",
    name: "Ostatní neinvestiční přijaté transfery ze zahraničí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4160",
    name: "Neinvestiční přijaté transfery ze státních finančních aktiv",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4211",
    name: "Investiční přijaté transfery z všeobecné pokladní správy stá",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4212",
    name: "Investiční přijaté transfery ze státního rozpočtu v rámci so",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4213",
    name: "Investiční přijaté transfery ze státních fondů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4214",
    name: "Investiční přijaté transfery ze zvláštních fondů ústřední úr",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4216",
    name: "Ostatní investiční přijaté transfery ze státního rozpočtu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4218",
    name: "Investiční převody z Národního fondu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4219",
    name: "Ostatní investiční přijaté transfery od veřejných rozpočtů ú",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4221",
    name: "Investiční přijaté transfery od obcí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4222",
    name: "Investiční přijaté transfery od krajů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4223",
    name: "Investiční přijaté transfery od regionálních rad",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4229",
    name: "Ostatní investiční přijaté transfery od rozpočtů územní úrov",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4231",
    name: "Investiční přijaté transfery od cizích států",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4232",
    name: "Investiční přijaté transfery od mezinárodních institucí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4233",
    name: "Investiční transfery přijaté od Evropské unie",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4234",
    name: "Investiční transfery z finančních mechanismů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4235",
    name: "Investiční transfery od NATO",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4240",
    name: "Investiční přijaté transfery ze státních finančních aktiv",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "4251",
    name: "Inv.převody-statutární města (Praha) a obvody/části - příjmy",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5011",
    name: "Platy zam. v prac. poměru vyjma zam. na služeb. místech",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5012",
    name: "Platy zaměstnanců bezp. sborů a ozbrojených sil ve SP",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5013",
    name: "Platy zam. na služebních místech podle zák. o státní službě",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5014",
    name: "Platy zaměstnanců v pracovním poměru odvozované od platů úst",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "5019", name: "Ostatní platy", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "5021",
    name: "Ostatní osobní výdaje",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5022",
    name: "Platy představitelů státní moci a některých orgánů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5023",
    name: "Odměny členů zastupitelstev obcí a krajů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "5024", name: "Odstupné", validFrom: "1900-01-01T00:00:00.000Z" },
  { id: "5025", name: "Odbytné", validFrom: "1900-01-01T00:00:00.000Z" },
  { id: "5026", name: "Odchodné", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "5027",
    name: "Peněžní náležitosti vojáků v záloze ve službě",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5028",
    name: "Kázeňské odměny poskytnuté formou peněžitých darů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5029",
    name: "Ostatní platby za provedenou práci jinde nezařazené",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5031",
    name: "Povinné pojistné na sociální zabezpečení a příspěvek na stát",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5032",
    name: "Povinné pojistné na veřejné zdravotní pojištění",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5038",
    name: "Povinné pojistné na úrazové pojištění",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5039",
    name: "Ostatní povinné pojistné placené zaměstnavatelem",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5041",
    name: "Odměny za užití duševního vlastnictví",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5042",
    name: "Odměny za užití počítačových programů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "5051", name: "Mzdové náhrady", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "5061",
    name: "Mzdy podle cizího práva",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5122",
    name: "Podlimitní věcná břemena",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5123",
    name: "Podlimitní technické zhodnocení",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "5131", name: "Potraviny", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "5132",
    name: "Ochranné pomůcky",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5133",
    name: "Léky a zdravotnický materiál",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5134",
    name: "Prádlo, oděv a obuv",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5135",
    name: "Učebnice a bezplatně poskytované školní potřeby",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5136",
    name: "Knihy, učební pomůcky a tisk",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5137",
    name: "Drobný hmotný dlouhodobý majetek",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5138",
    name: "Nákup zboží (za účelem dalšího prodeje)",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5139",
    name: "Nákup materiálu jinde nezařazený",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "5141", name: "Úroky vlastní", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "5142",
    name: "Kursové rozdíly ve výdajích",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5143",
    name: "Úroky vzniklé převzetím cizích závazků",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5144",
    name: "Poplatky dluhové služby",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5145",
    name: "Neúrokové výdaje na finanční deriváty k vlastním dluhopisům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5146",
    name: "Úrokové výdaje na finanční deriváty k vlastním dluhopisům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5147",
    name: "Úrokové výdaje na fin. deriváty kromě k vlastním dluhopisům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5148",
    name: "Neúrokové výd. na finanč. deriváty kromě k vlast. dluhopisům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5149",
    name: "Ostatní úroky a ostatní finanční výdaje",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "5151", name: "Studená voda", validFrom: "1900-01-01T00:00:00.000Z" },
  { id: "5152", name: "Teplo", validFrom: "1900-01-01T00:00:00.000Z" },
  { id: "5153", name: "Plyn", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "5154",
    name: "Elektrická energie",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "5155", name: "Pevná paliva", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "5156",
    name: "Pohonné hmoty a maziva",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "5157", name: "Teplá voda", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "5159",
    name: "Nákup ostatních paliv a energie",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5161",
    name: "Poštovní služby",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5162",
    name: "Služby elektronických komunikací",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5163",
    name: "Služby peněžních ústavů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "5164", name: "Nájemné", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "5165",
    name: "Nájemné za půdu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5166",
    name: "Konzultační, poradenské a právní služby",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5167",
    name: "Služby školení a vzdělávání",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5168",
    name: "Zpracování dat a služby související s inf.a komunik.technol.",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5169",
    name: "Nákup ostatních služeb",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5171",
    name: "Opravy a udržování",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5172",
    name: "Programové vybavení",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "5173", name: "Cestovné", validFrom: "1900-01-01T00:00:00.000Z" },
  { id: "5175", name: "Pohoštění", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "5176",
    name: "Účastnické poplatky na konference",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5177",
    name: "Nákup archiválií",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5178",
    name: "Nájemné za nájem s právem koupě",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5179",
    name: "Ostatní nákupy jinde nezařazené",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5181",
    name: "Převody vnitřním organizačním jednotkám",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5182",
    name: "Převody vlastní pokladně",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5183",
    name: "Výdaje na realizaci záruk",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5184",
    name: "Výdaje na vládní úvěry",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5185",
    name: "Převody do elektronických peněženek",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "5189", name: "Jistoty", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "5191",
    name: "Zaplacené sankce",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5192",
    name: "Poskytnuté náhrady",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5193",
    name: "Výdaje na dopravní územní obslužnost",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "5194", name: "Věcné dary", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "5195",
    name: "Odvody za neplnění povinnosti zaměstnávat zdravotně postižen",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5196",
    name: "Náhrady a příspěvky související s výkonem ústavní funkce a f",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5197",
    name: "Náhrady zvýšených nákladů spojených s výkonem funkce v zahra",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5198",
    name: "Finanční náhrady v rámci majetkového vyrovnání s církvemi",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5199",
    name: "Ostatní výdaje související s neinvestičními nákupy",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5211",
    name: "Neinvestiční transfery finančním institucím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5212",
    name: "Neinvestiční transfery nefinančním podnikatelskýmsubjektům-f",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5213",
    name: "Neinvestiční transfery nefinančním podnikatelským subjektům-",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5214",
    name: "Neinvestiční transfery finančním a podobným institucím ve vl",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5215",
    name: "Neinvestiční transfery vybraným podnikatelským subjektům ve",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5216",
    name: "Neinv. transf. obecním a krajským nemocnicím - obchod. spol.",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5219",
    name: "Ostatní neinvestiční transfery podnikatelským subjektům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5221",
    name: "Neinv. transf. fundacím, ústavům a obecně prospěšným společ.",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5222",
    name: "Neinvestiční transfery spolkům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5223",
    name: "Neinvestiční transfery církvím a náboženským společnostem",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5224",
    name: "Neinvestiční transfery politickým stranám a hnutím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5225",
    name: "Neinvestiční transfery společenstvím vlastníků jednotek",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5229",
    name: "Ostatní neinvestiční transfery neziskovým a podobným organiz",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5250",
    name: "Refundace poloviny náhrady mzdy za dočasnou pracovní neschop",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5311",
    name: "Neinvestiční transfery státnímu rozpočtu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5312",
    name: "Neinvestiční transfery státním fondům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5313",
    name: "Neinvestiční transfery zvláštním fondům ústřední úrovně",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5314",
    name: "Neinvestiční transfery fondům sociálního a veřejného zdravot",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5315",
    name: "Odvod daně za zaměstnance",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5316",
    name: "Odvod pojistného na sociální zabezpečení a  příspěvku na stá",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5317",
    name: "Odvod pojistného na veřejné zdravotní pojištění za zaměstnan",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5318",
    name: "Neinvestiční transfery prostředků do státních finančních akt",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5319",
    name: "Ostatní neinvestiční transfery jiným veřejným rozpočtům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5321",
    name: "Neinvestiční transfery obcím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5322",
    name: "Neinvestiční transfery obcím v rámci souhrnného dotačního vz",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5323",
    name: "Neinvestiční transfery krajům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5324",
    name: "Neinvestiční transfery krajům v rámci souhrnného dotačního v",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5325",
    name: "Neinvestiční transfery regionálním radám",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5329",
    name: "Ostatní neinvestiční transfery veřejným rozpočtům územní úro",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5331",
    name: "Neinvestiční příspěvky zřízeným příspěvkovým organizacím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5332",
    name: "Neinvestiční transfery vysokým školám",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5333",
    name: "Neinvestiční transfery školským právnickým osobámzřízeným st",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5334",
    name: "Neinvestiční transfery veřejným výzkumným institucím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5336",
    name: "Neinvestiční transfery zřízeným příspěvkovým organizacím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5339",
    name: "Neinvestiční  transfery cizím příspěvkovým organizacím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5341",
    name: "Převody vlastním fondům hospodářské (podnikatelské) činnosti",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5342",
    name: "Základní příděl FKSP a sociálnímu fondu obcí a krajů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5343",
    name: "Převody na účty nemající povahu veřejných rozpočtů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5344",
    name: "Převody vlastním rezervním fondům územních rozpočtů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5345",
    name: "Převody vlastním rozpočtovým účtům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5346",
    name: "Převody do fondů organizačních složek státu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5347",
    name: "Neinv.převody-statutární města (Praha) a obvody/části-výdaje",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5348",
    name: "Převody do vlastní pokladny",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5349",
    name: "Ostatní převody vlastním fondům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5350",
    name: "Převody do vlastních fondů přes rok",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "5361", name: "Nákup kolků", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "5362",
    name: "Platby daní a poplatků státnímu rozpočtu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5363",
    name: "Úhrady sankcí jiným rozpočtům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5364",
    name: "Vratky transferů poskytnutých z veřejných rozpočtů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5365",
    name: "Platby daní a poplatků krajům, obcím a státním fondům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5366",
    name: "Výdaje z finančního vypořádání minulých let mezi krajem a ob",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5367",
    name: "Výdaje z finančního vypořádání minulých let mezi obcemi",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5368",
    name: "Výdaje z finančního vypořádání minulých let mezi regionální",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5369",
    name: "Ostatní neinvestiční transfery jiným veřejným rozpočtům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "5410", name: "Sociální dávky", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "5421",
    name: "Náhrady z úrazového pojištění",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5423",
    name: "Náhrady mezd podle zákona č. 118/2000 Sb.",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5424",
    name: "Náhrady mezd v době nemoci",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5425",
    name: "Příspěvek na pohřeb dárce org.a náhrada posk.žijícímu dárci",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5491",
    name: "Stipendia žákům, studentům a doktorandům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5492",
    name: "Dary obyvatelstvu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5493",
    name: "Účelové neinvestiční transfery fyzickým osobám",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5494",
    name: "Neinvestiční transfery obyvatelstvu nemající charakter daru",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5495",
    name: "Stabilizační příspěvek vojákům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5496",
    name: "Služební příspěvek vojákům na bydlení",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5497",
    name: "Náborový příspěvek",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5498",
    name: "Kvalifikační příspěvek a jednorázová peněžní výpomoc vojákům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5499",
    name: "Ostatní neinvestiční transfery obyvatelstvu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5511",
    name: "Neinvestiční transfery mezinárodním vládním organizacím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5512",
    name: "Neinvestiční transfery nadnárodním orgánům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5513",
    name: "Vratky neoprávněně použitých nebo zadržených prostředků EU",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5514",
    name: "Odvody vlastních zdrojů EU do rozpočtu EU podle DPH",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5515",
    name: "Odvody vlastních zdrojů EU do rozpočtu EU podle HND",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5516",
    name: "Odvody Evropské unii ke krytí záporných úroků",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5517",
    name: "Odvody vl. zdr. EU do rozp. EU-objem nerecykl. plast. obalů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5520",
    name: "Neinvestiční transfery cizím státům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5531",
    name: "Peněžní dary do zahraničí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5532",
    name: "Ostatní neinvestiční transfery do zahraničí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5541",
    name: "Členské příspěvky mezinárodním vládním organizacím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5542",
    name: "Členské příspěvky mezinárodním nevládním organizacím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5611",
    name: "Neinvestiční půjčené prostředky finančním institucím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5612",
    name: "Neinvestiční půjčené prostředky nefinančním podnikatelským s",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5613",
    name: "Neinvestiční půjčené prostředky nefinančním podnikatelským s",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5614",
    name: "Neinvestiční půjčené prostředky finančním a podobným institu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5615",
    name: "Neinvestiční půjčené prostředky vybraným podnikatelským subj",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5619",
    name: "Ostatní neinvestiční půjčené prostředky podnikatelským subje",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5621",
    name: "Neinv. půjč. pr. fundacím, ústavům a obecně prospěšným spol.",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5622",
    name: "Neinvestiční půjčené prostředky spolkům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5623",
    name: "Neinvestiční půjčené prostředky církvím a náboženským společ",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5624",
    name: "Neinvestiční půjčené prostředky společenstvím vlastníků jedn",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5629",
    name: "Ostatní neinvestiční půjčené prostředky neziskovým a podobný",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5631",
    name: "Neinvestiční půjčené prostředky státnímu rozpočtu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5632",
    name: "Neinvestiční půjčené prostředky státním fondům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5633",
    name: "Neinvestiční půjčené prostředky zvláštním fondům ústřední úr",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5634",
    name: "Neinvestiční půjčené prostředky fondům sociálního a zdravotn",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5639",
    name: "Ostatní neinvestiční půjčené prostředky jiným veřejným rozpo",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5641",
    name: "Neinvestiční půjčené prostředky obcím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5642",
    name: "Neinvestiční půjčené prostředky krajům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5643",
    name: "Neinvestiční půjčené prostředky regionálním radám",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5649",
    name: "Ostatní neinvestiční půjčené prostředky veřejným rozpočtům ú",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5651",
    name: "Neinvestiční půjčené prostředky zřízeným příspěvkovým organi",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5652",
    name: "Neinvestiční půjčené prostředky vysokým školám",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5659",
    name: "Neinvestiční půjčené prostředky ostatním příspěvkovým organi",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5660",
    name: "Neinvestiční půjčené prostředky obyvatelstvu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5670",
    name: "Neinvestiční půjčené prostředky do zahraničí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5710",
    name: "Převody Národnímu fondu na spolufinancování programu Phare",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5720",
    name: "Převody Národnímu fondu na spolufinancování programu Ispa",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5730",
    name: "Převody Národnímu fondu na spolufinancování programu Sapard",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5740",
    name: "Převody Národnímu fondu na spolufinancování komunitárních pr",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5750",
    name: "Převody NF na spolufinancování ostatních programů EU a ČR",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5760",
    name: "Převody Národnímu fondu na spolufinancování související s po",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5770",
    name: "Převody ze státního rozpočtu do Národního fondu na vyrovnání",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5790",
    name: "Ostatní převody do Národního fondu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5811",
    name: "Výdaje na náhrady za nezpůsobenou újmu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5901",
    name: "Nespecifikované rezervy",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5902",
    name: "Ostatní výdaje z finančního vypořádání minulých let",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5903",
    name: "Rezerva na krizová opatření",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5904",
    name: "Převody domněle neoprávněně použ. dotací zpět poskytovateli",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5909",
    name: "Ostatní neinvestiční výdaje jinde nezařazené",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "5991",
    name: "Dočasné zatřídění výdajů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6111",
    name: "Programové vybavení",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6112",
    name: "Ocenitelná práva",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6113",
    name: "Nehmotné výsledky výzkumné a obdobné činnosti",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6119",
    name: "Ostatní nákup dlouhodobého nehmotného majetku",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6121",
    name: "Budovy, haly a stavby",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6122",
    name: "Stroje, přístroje a zařízení",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6123",
    name: "Dopravní prostředky",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6124",
    name: "Pěstitelské celky trvalých porostů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6125",
    name: "Výpočetní technika",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6127",
    name: "Kuturní předměty",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6129",
    name: "Nákup dlouhodobého hmotného majetku jinde nezařazený",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "6130", name: "Pozemky", validFrom: "1900-01-01T00:00:00.000Z" },
  { id: "6141", name: "Právo stavby", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "6142",
    name: "Nadlimitní věcná břemena",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  { id: "6201", name: "Nákup akcií", validFrom: "1900-01-01T00:00:00.000Z" },
  {
    id: "6202",
    name: "Nákup majetkových podílů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6209",
    name: "Nákup ostatních majetkových nároků",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6211",
    name: "Vklady do nadací",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6212",
    name: "Vklady do nadačních fondů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6213",
    name: "Vklady do ústavů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6311",
    name: "Investiční transfery finančním institucím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6312",
    name: "Investiční transfery nefinančním podnikatelským subjektům-fy",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6313",
    name: "Investiční transfery nefinančním podnikatelským subjektům-pr",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6314",
    name: "Investiční transfery finančním a podobným institucím ve vlas",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6315",
    name: "Investiční transfery vybraným podnikatelským subjektům ve vl",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6316",
    name: "Inv. transf. obecním a krajským nemocnicím - obchod. společ.",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6319",
    name: "Ostatní investiční transfery podnikatelským subjektům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6321",
    name: "Inv. transf. fundacím, ústavům a obecně prospěšným společn.",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6322",
    name: "Investiční transfery spolkům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6323",
    name: "Investiční transfery církvím a náboženským společnostem",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6324",
    name: "Investiční transfery společenstvím vlastníků jednotek",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6329",
    name: "Ostatní investiční transfery neziskovým a podobným organizac",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6331",
    name: "Investiční transfery státnímu rozpočtu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6332",
    name: "Investiční transfery státním fondům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6333",
    name: "Investiční transfery zvláštním fondům ústřední úrovně",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6334",
    name: "Investiční transfery fondům sociálního a zdravotního pojiště",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6335",
    name: "Investiční transfery státním finančním aktivům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6339",
    name: "Ostatní investiční transfery jiným veřejným rozpočtům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6341",
    name: "Investiční transfery obcím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6342",
    name: "Investiční transfery krajům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6343",
    name: "Investiční transfery obcím v rámci souhrnného dotačního vzta",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6344",
    name: "Investiční transfery krajům v rámci souhrnného dotačního vzt",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6345",
    name: "Investiční transfery regionálním radám",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6349",
    name: "Ostatní investiční transfery veřejným rozpočtům územní úrovn",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6351",
    name: "Investiční transfery zřízeným příspěvkovým organizacím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6352",
    name: "Investiční transfery vysokým školám",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6353",
    name: "Investiční transfery školským právnickým osobám zřízeným stá",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6354",
    name: "Investiční transfery veřejným výzkumným institucím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6356",
    name: "Jiné investiční transfery zřízeným příspěvkovým organizacím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6359",
    name: "Investiční transfery ostatním příspěvkovým organizacím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6361",
    name: "Investiční převody do rezervního fondu organizačních složek",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6362",
    name: "Převody investičních prostředků zpět do FKSP",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6363",
    name: "Inv.převody-statutární města (Praha) a obvody/části - výdaje",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6371",
    name: "Účelové investiční transfery nepodnikajícím fyzickým osobám",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6379",
    name: "Ostatní investiční transfery obyvatelstvu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6380",
    name: "Investiční transfery do zahraničí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6411",
    name: "Investiční půjčené prostředky finančním institucím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6412",
    name: "Investiční půjčené prostředky nefinančním podnikatelským sub",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6413",
    name: "Investiční půjčené prostředky nefinančním podnikatelským sub",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6414",
    name: "Investiční půjčené prostředky finančním a podobným institucí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6415",
    name: "Investiční půjčené prostředky vybraným podnikatelským subjek",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6419",
    name: "Ostatní investiční půjčené prostředky podnikatelským subjekt",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6421",
    name: "Inv. půjč. pr. fundacím, ústavům a obecně prospěšným společ.",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6422",
    name: "Investiční půjčené prostředky spolkům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6423",
    name: "Investiční půjčené prostředky církvím a náboženským společno",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6424",
    name: "Investiční půjčené prostředky společenstvím vlastníků jednot",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6429",
    name: "Ostatní investiční půjčené prostředky neziskovým a podobným",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6431",
    name: "Investiční půjčené prostředky státnímu rozpočtu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6432",
    name: "Investiční půjčené prostředky státním fondům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6433",
    name: "Investiční půjčené prostředky zvláštním fondům ústřední úrov",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6434",
    name: "Investiční půjčené prostředky fondům sociálního a zdravotníh",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6439",
    name: "Ostatní investiční půjčené prostředky jiným veřejným rozpočt",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6441",
    name: "Investiční půjčené prostředky obcím",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6442",
    name: "Investiční půjčené prostředky krajům",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6443",
    name: "Investiční půjčené prostředky regionálním radám",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6449",
    name: "Ostatní investiční půjčené prostředky veřejným rozpočtům mís",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6451",
    name: "Investiční půjčené prostředky zřízeným příspěvkovým organiza",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6452",
    name: "Investiční půjčené prostředky vysokým školám",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6459",
    name: "Investiční půjčené prostředky ostatním příspěvkovým organiza",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6460",
    name: "Investiční půjčené prostředky obyvatelstvu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6470",
    name: "Investiční půjčené prostředky do zahraničí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6710",
    name: "Investiční převody Národnímu fondu na spolufinancování progr",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6720",
    name: "Investiční převody Národnímu fondu na spolufinancování progr",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6730",
    name: "Investiční převody Národnímu fondu na spolufinancování progr",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6740",
    name: "Investiční převody Národnímu fondu na spolufinancování komun",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6750",
    name: "Inv. převody NF na spolufinancování ost. programů EU a ČR",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6760",
    name: "Investiční převody Národnímu fondu na spolufinancování souvi",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6790",
    name: "Ostatní investiční převody do Národního fondu",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6901",
    name: "Rezervy kapitálových výdajů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "6909",
    name: "Ostatní kapitálové výdaje jinde nezařazené",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8111",
    name: "Krátkodobé vydané dluhopisy",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8112",
    name: "Uhrazené splátky krátkodobých vydaných dluhopisů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8113",
    name: "Krátkodobé přijaté půjčené prostředky",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8114",
    name: "Uhrazené splátky krátkodobých přijatých půjčených prostředků",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8115",
    name: "Změny st.krátk.pr.na bank.úč. kr. změn st. účtů SFA-kap.OSFA",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8116",
    name: "Změny stavu bank.účtů krátk.prostř. SFA, kt. tvoří kap. OSFA",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8117",
    name: "Aktivní krátkodobé operace řízení likvidity - příjmy",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8118",
    name: "Aktivní krátkodobé operace řízení likvidity - výdaje",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8121",
    name: "Dlouhodobé vydané dluhopisy",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8122",
    name: "Uhrazené splátky dlouhodobých vydaných dluhopisů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8123",
    name: "Dlouhodobé přijaté půjčené prostředky",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8124",
    name: "Uhrazené splátky dlouhodobých přijatých půjčenýchprostředků",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8125",
    name: "Změna stavu dlouhodobých prostředků na bankovních účtech",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8127",
    name: "Aktivní dlouhodobé operace řízení likvidity - příjmy",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8128",
    name: "Aktivní dlouhodobé operace řízení likvidity - výdaje",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8211",
    name: "Krátkodobé vydané dluhopisy",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8212",
    name: "Uhrazené splátky krátkodobých vydaných dluhopisů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8213",
    name: "Krátkodobé přijaté půjčené prostředky",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8214",
    name: "Uhrazené splátky krátkodobých přijatých půjčenýchprostředků",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8215",
    name: "Změna stavu bank.účtů krátk.prost.zahr.kromě úvěrů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8216",
    name: "Změna stavu bank.účtů krátk.prost.z dlouh.úvěrů ze zahraničí",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8217",
    name: "Aktivní krátkodobé operace řízení likvidity - příjmy",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8218",
    name: "Aktivní krátkodobé operace řízení likvidity - výdaje",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8221",
    name: "Dlouhodobé vydané dluhopisy",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8222",
    name: "Uhrazené splátky dlouhodobých vydaných dluhopisů",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8223",
    name: "Dlouhodobé přijaté půjčené prostředky",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8224",
    name: "Uhrazené splátky dlouhodobých přijatých půjčených prostředků",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8225",
    name: "Změna stavu dlouhodobých prostředků na bankovních účtech",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8227",
    name: "Aktivní dlouhodobé operace řízení likvidity - příjmy",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8228",
    name: "Aktivní dlouhodobé operace řízení likvidity - výdaje",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8300",
    name: "Pohyby na účtech pro financování nepatřící na jiné položky",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8301",
    name: "Převody ve vztahu k úvěrům od Evropské investiční banky",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8302",
    name: "Operace na bankovních účtech OSFA",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8413",
    name: "Krátkodobé přijaté půjčené prostředky",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8414",
    name: "Uhrazené splátky krátkodobých přijatých půjčených prostředků",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8417",
    name: "Krátkodobé akt. fin.-jader. a účet rezervy důchod. pojišt.-P",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8418",
    name: "Krátkodobé akt. fin.-jader. a účet rezervy důchod. pojišt.-V",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8427",
    name: "Dlouhodobé akt. fin.-jader. a účet rezervy důchod. pojišt.-P",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8428",
    name: "Dlouhodobé akt. fin.-jader. a účet rezervy důchod. pojišt.-V",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8901",
    name: "Operace z peněžních účtů organizace nemající charakter příjm",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8902",
    name: "Nerealizované kursové rozdíly pohybů na devizových účtech",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
  {
    id: "8905",
    name: "Nepřevedené částky vyrovnávající schodek a saldo stát. pokl.",
    validFrom: "1900-01-01T00:00:00.000Z",
  },
];

exports.up = async function (knex) {
  for (const paragraph of data) {
    if ((await knex("data.codelists").where("id", paragraph.id)).length > 0) {
      await knex("data.codelists")
        .where("id", paragraph.id)
        .update("name", paragraph.name);
    } else {
      await knex("data.codelists").insert({
        codelist: "paragraph",
        ...paragraph,
      });
    }
  }
};

exports.down = async function (knex) {
  return knex("data.codelists").delete();
};
