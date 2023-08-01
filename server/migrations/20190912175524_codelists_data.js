const data = [
  {
    name: 'paragraphs',
    data: [
      {id: '0', name: 'Pro příjmy (technický záznam)'},
      {
        id: '1011',
        name:
          'Udržování výrobního potenciálu zemědělství, zemědělský půdní fond a mimoprodukční funkce zemědělství',
      },
      {
        id: '1012',
        name: 'Podnikání a restrukturalizace v zemědělství a potravinářství',
      },
      {
        id: '1013',
        name: 'Genetický potenciál hospodářských zvířat, osiv a sádí',
      },
      {
        id: '1014',
        name:
          'Ozdravování hospodářských zvířat, polních a speciálních plodin a zvláštní veterinární péče',
      },
      {id: '1019', name: 'Ostatní zemědělská a potravinářská činnost a rozvoj'},
      {id: '1021', name: 'Organizace trhu s produkty rostlinné výroby'},
      {
        id: '1022',
        name:
          'Organizace trhu s výrobky vzniklými zpracováním produktů rostlinné výroby',
      },
      {id: '1023', name: 'Organizace trhu s produkty živočišné výroby'},
      {
        id: '1024',
        name:
          'Organizace trhu s výrobky vzniklými zpracováním produktů živočišné výroby',
      },
      {
        id: '1029',
        name:
          'Ostatní záležitosti regulace zemědělské produkce, organizace zemědělského trhu a poskytování podpor',
      },
      {id: '1031', name: 'Pěstební činnost'},
      {id: '1032', name: 'Podpora ostatních produkčních činností'},
      {id: '1036', name: 'Správa v lesním hospodářství'},
      {id: '1037', name: 'Celospolečenské funkce lesů'},
      {id: '1039', name: 'Ostatní záležitosti lesního hospodářství'},
      {
        id: '1061',
        name: 'Činnost ústředního orgánu státní správy v zemědělství',
      },
      {
        id: '1062',
        name: 'Činnost ostatních orgánů státní správy v zemědělství',
      },
      {id: '1063', name: 'Správa zemědělského majetku'},
      {id: '1069', name: 'Ostatní správa v zemědělství'},
      {id: '1070', name: 'Rybářství'},
      {id: '1081', name: 'Zemědělský výzkum a vývoj'},
      {id: '1082', name: 'Lesnický výzkum'},
      {id: '1091', name: 'Mezinárodní spolupráce v zemědělství'},
      {id: '1092', name: 'Mezinárodní spolupráce v lesním hospodářství'},
      {id: '1098', name: 'Ostatní výdaje na zemědělství'},
      {id: '1099', name: 'Ostatní výdaje na lesní hospodářství'},
      {id: '2111', name: 'Uhelné hornictví'},
      {id: '2112', name: 'Těžba nerostných surovin kromě paliv'},
      {id: '2113', name: 'Zpracování ropy a zemního plynu'},
      {id: '2114', name: 'Jaderné elektrárny'},
      {id: '2115', name: 'Úspora energie a obnovitelné zdroje'},
      {id: '2116', name: 'Jaderné palivo a ochrana před ionizujícím zářením'},
      {id: '2117', name: 'Elektrická energie'},
      {id: '2118', name: 'Energie jiná než elektrická'},
      {id: '2119', name: 'Ostatní záležitosti těžebního průmyslu a energetiky'},
      {id: '2121', name: 'Stavebnictví'},
      {id: '2122', name: 'Sběr a zpracování druhotných surovin'},
      {id: '2123', name: 'Podpora rozvoje průmyslových zón'},
      {
        id: '2124',
        name: 'Opatření ke zvýšení konkurenceschopnosti průmyslových odvětví',
      },
      {id: '2125', name: 'Podpora podnikání a inovací'},
      {id: '2129', name: 'Ostatní odvětvová a oborová opatření'},
      {id: '2131', name: 'Přímá podpora exportu'},
      {id: '2139', name: 'Ostatní záležitosti zahraničního obchodu'},
      {id: '2141', name: 'Vnitřní obchod'},
      {id: '2142', name: 'Ubytování a stravování'},
      {id: '2143', name: 'Cestovní ruch'},
      {id: '2144', name: 'Ostatní služby'},
      {
        id: '2161',
        name:
          'Činnost ústředního orgánu státní správy v odvětví energetiky, průmyslu, stavebnictví, obchodu a služeb',
      },
      {
        id: '2162',
        name:
          'Činnost ostatních orgánů státní správy v průmyslu, stavebnictví, obchodu a službách',
      },
      {
        id: '2169',
        name: 'Ostatní správa v průmyslu, stavebnictví, obchodu a službách',
      },
      {id: '2181', name: 'Výzkum a vývoj v palivech a energetice'},
      {id: '2182', name: 'Výzkum a vývoj v průmyslu kromě paliv a energetiky'},
      {id: '2183', name: 'Výzkum a vývoj ve službách'},
      {id: '2184', name: 'Výzkum a vývoj v obchodu a cestovním ruchu'},
      {id: '2185', name: 'Výzkum a vývoj ve stavebnictví'},
      {
        id: '2191',
        name:
          'Mezinárodní spolupráce v průmyslu, stavebnictví, obchodu a službách',
      },
      {
        id: '2199',
        name:
          'Záležitosti průmyslu, stavebnictví, obchodu a služeb jinde nezařazené',
      },
      {id: '2211', name: 'Dálnice'},
      {id: '2212', name: 'Silnice'},
      {id: '2219', name: 'Ostatní záležitosti pozemních komunikací'},
      {id: '2221', name: 'Provoz veřejné silniční dopravy'},
      {id: '2222', name: 'Kontrola technické způsobilosti vozidel'},
      {id: '2223', name: 'Bezpečnost silničního provozu'},
      {id: '2229', name: 'Ostatní záležitosti v silniční dopravě'},
      {id: '2231', name: 'Vodní cesty'},
      {id: '2232', name: 'Provoz vnitrozemské plavby'},
      {id: '2233', name: 'Záležitosti námořní dopravy'},
      {id: '2239', name: 'Ostatní záležitosti vnitrozemské plavby'},
      {id: '2241', name: 'Železniční dráhy'},
      {id: '2242', name: 'Provoz veřejné železniční dopravy'},
      {id: '2243', name: 'Drážní vozidla'},
      {id: '2249', name: 'Ostatní záležitosti železniční dopravy'},
      {id: '2251', name: 'Letiště'},
      {id: '2252', name: 'Zabezpečení letového provozu'},
      {id: '2253', name: 'Provoz civilní letecké dopravy'},
      {id: '2259', name: 'Ostatní záležitosti civilní letecké dopravy'},
      {id: '2261', name: 'Činnost ústředních orgánů státní správy v dopravě'},
      {id: '2262', name: 'Činnost ostatních orgánů státní správy v dopravě'},
      {id: '2269', name: 'Ostatní správa v dopravě'},
      {id: '2271', name: 'Ostatní dráhy'},
      {id: '2272', name: 'Provoz ostatních drah'},
      {id: '2279', name: 'Záležitosti ostatních drah jinde nezařazené'},
      {id: '2280', name: 'Výzkum a vývoj v dopravě'},
      {id: '2291', name: 'Mezinárodní spolupráce v dopravě'},
      {id: '2292', name: 'Dopravní obslužnost'},
      {id: '2299', name: 'Ostatní záležitosti v dopravě'},
      {id: '2310', name: 'Pitná voda'},
      {id: '2321', name: 'Odvádění a čištění odpadních vod a nakládání s kaly'},
      {id: '2322', name: 'Prevence znečišťování vody'},
      {id: '2329', name: 'Odvádění a čištění odpadních vod jinde nezařazené'},
      {
        id: '2331',
        name: 'Úpravy vodohospodářsky významných a vodárenských toků',
      },
      {
        id: '2332',
        name: 'Vodní díla na vodohospodářsky významných a vodárenských tocích',
      },
      {id: '2333', name: 'Úpravy drobných vodních toků'},
      {id: '2334', name: 'Revitalizace říčních systémů'},
      {
        id: '2339',
        name:
          'Záležitosti vodních toků a vodohospodářských děl jinde nezařazené',
      },
      {id: '2341', name: 'Vodní díla v zemědělské krajině'},
      {id: '2342', name: 'Protierozní ochrana'},
      {id: '2349', name: 'Ostatní záležitosti vody v zemědělské krajině'},
      {
        id: '2361',
        name: 'Činnost ústředních orgánů státní správy ve vodním hospodářství',
      },
      {
        id: '2362',
        name: 'Činnost ostatních orgánů státní správy ve vodním hospodářství',
      },
      {id: '2369', name: 'Ostatní správa ve vodním hospodářství'},
      {id: '2380', name: 'Vodohospodářský výzkum a vývoj'},
      {
        id: '2391',
        name: 'Mezinárodní spolupráce v oblasti vodního hospodářství',
      },
      {id: '2399', name: 'Ostatní záležitosti vodního hospodářství'},
      {id: '2411', name: 'Záležitosti pošt'},
      {id: '2412', name: 'Záležitosti telekomunikací'},
      {id: '2413', name: 'Záležitosti radiokomunikací'},
      {id: '2419', name: 'Ostatní záležitosti spojů'},
      {id: '2461', name: 'Činnost ústředních orgánů státní správy ve spojích'},
      {id: '2462', name: 'Činnost ostatních orgánů státní správy ve spojích'},
      {id: '2469', name: 'Ostatní správa ve spojích'},
      {id: '2480', name: 'Výzkum a vývoj ve spojích'},
      {id: '2491', name: 'Mezinárodní spolupráce ve spojích'},
      {id: '2499', name: 'Ostatní záležitosti spojů'},
      {id: '2510', name: 'Podpora podnikání'},
      {id: '2521', name: 'Bezpečnost práce'},
      {id: '2529', name: 'Všeobecné pracovní záležitosti jinde nezařazené'},
      {id: '2531', name: 'Centrální banka a měna'},
      {id: '2539', name: 'Všeobecné finanční záležitosti jinde nezařazené'},
      {id: '2541', name: 'Geologie'},
      {id: '2542', name: 'Meteorologie'},
      {id: '2549', name: 'Všeobecné hospodářské služby jinde nezařazené'},
      {
        id: '2561',
        name: 'Činnost ústředních orgánů státní správy v oblasti hospodářství',
      },
      {
        id: '2562',
        name:
          'Činnost ostatních orgánů a organizací v oblasti normalizace, standardizace a metrologie',
      },
      {
        id: '2563',
        name:
          'Činnost ostatních orgánů státní správy v zeměměřictví a katastru',
      },
      {id: '2564', name: 'Správa národního majetku'},
      {
        id: '2565',
        name:
          'Činnost ostatních orgánů státní správy v oblasti bezpečnosti práce',
      },
      {id: '2569', name: 'Všeobecná hospodářská správa jinde nezařazená'},
      {
        id: '2580',
        name: 'Výzkum a vývoj v oblasti všeobecných hospodářských záležitostí',
      },
      {
        id: '2590',
        name:
          'Mezinárodní spolupráce ve všeobecných hospodářských záležitostech.',
      },
      {id: '3111', name: 'Mateřské školy'},
      {
        id: '3112',
        name: 'Mateřské školy pro děti se speciálními vzdělávacími potřebami',
      },
      {id: '3113', name: 'Základní školy'},
      {
        id: '3114',
        name: 'Základní školy pro žáky se speciálními vzdělávacími potřebami',
      },
      {id: '3115', name: 'Ostatní záležitosti předškolního vzdělávání'},
      {id: '3117', name: 'První stupeň základních škol'},
      {id: '3118', name: 'Druhý stupeň základních škol'},
      {id: '3119', name: 'Ostatní záležitosti základního vzdělávání'},
      {id: '3121', name: 'Gymnazia'},
      {id: '3122', name: 'Střední odborné školy'},
      {
        id: '3123',
        name: 'Střední školy poskytující střední vzdělání s výučním listem',
      },
      {
        id: '3124',
        name:
          'Střední školy a konzervatoře pro žáky se speciálními vzdělávacími potřebami',
      },
      {
        id: '3125',
        name: 'Střediska praktického vyučování a školní hospodářství',
      },
      {id: '3126', name: 'Konzervatoře'},
      {id: '3127', name: 'Střední školy'},
      {id: '3128', name: 'Sportovní školy - gymnázia'},
      {id: '3129', name: 'Ostatní zařízení středního vzdělávání'},
      {id: '3131', name: 'Výchovné ústavy a dětské domovy se školou'},
      {id: '3132', name: 'Diagnostické ústavy'},
      {id: '3133', name: 'Dětské domovy'},
      {
        id: '3139',
        name: 'Ostatní školská zařízení pro výkon ústavní a ochranné výchovy',
      },
      {id: '3141', name: 'Školní stravování'},
      {id: '3143', name: 'Školní družiny a kluby'},
      {id: '3144', name: 'Školy v přírodě'},
      {id: '3145', name: 'Internáty'},
      {id: '3146', name: 'Zařízení výchovného poradenství'},
      {id: '3147', name: 'Domovy mládeže'},
      {id: '3148', name: 'Střediska výchovné péče'},
      {
        id: '3149',
        name: 'Ostatní zařízení související s výchovou a vzděláváním mládeže',
      },
      {id: '3150', name: 'Vyšší odborné školy'},
      {id: '3211', name: 'Vysoké školy'},
      {id: '3212', name: 'Výzkum, vývoj a inovace na vysokých školách'},
      {id: '3213', name: 'Bakalářské studium'},
      {id: '3214', name: 'Magisterské a doktorské studium'},
      {id: '3221', name: 'Vysokoškolské koleje a menzy'},
      {
        id: '3229',
        name: 'Ostatní zařízení související s vysokoškolským vzděláváním',
      },
      {id: '3231', name: 'Základní umělecké školy'},
      {id: '3232', name: 'Jazykové školy s právem státní jazykové zkoušky'},
      {id: '3233', name: 'Střediska volného času'},
      {id: '3239', name: 'Záležitosti zájmového vzdělávání jinde nezařazené'},
      {
        id: '3261',
        name: 'Činnost ústředního orgánu státní správy ve vzdělávání',
      },
      {
        id: '3262',
        name: 'Činnost ostatních orgánů státní správy ve vzdělávání',
      },
      {id: '3269', name: 'Ostatní správa ve vzdělávání jinde nezařazená'},
      {id: '3280', name: 'Výzkum školství a vzdělávání'},
      {id: '3291', name: 'Mezinárodní spolupráce ve vzdělávání'},
      {
        id: '3292',
        name: 'Vzdělávání národnostních menšin a multikulturní výchova',
      },
      {id: '3293', name: 'Vzdělávací akce k integraci Romů'},
      {
        id: '3294',
        name: 'Zařízení pro další vzdělávání pedagogických pracovníků',
      },
      {id: '3299', name: 'Ostatní záležitosti vzdělávání'},
      {id: '3311', name: 'Divadelní činnost'},
      {id: '3312', name: 'Hudební činnost'},
      {
        id: '3313',
        name:
          'Filmová tvorba, distribuce, kina a shromažďování audiovizuálních archiválií',
      },
      {id: '3314', name: 'Činnosti knihovnické'},
      {id: '3315', name: 'Činnosti muzeí a galerií'},
      {id: '3316', name: 'Vydavatelská činnost'},
      {id: '3317', name: 'Výstavní činnosti v kultuře'},
      {id: '3319', name: 'Ostatní záležitosti kultury'},
      {id: '3321', name: 'Činnosti památkových ústavů, hradů a zámků'},
      {id: '3322', name: 'Zachování a obnova kulturních památek'},
      {id: '3324', name: 'Výkup předmětů kulturní hodnoty'},
      {id: '3325', name: 'Pražský hrad'},
      {
        id: '3326',
        name:
          'Pořízení, zachování a obnova hodnot místního kulturního, národního a historického povědomí',
      },
      {
        id: '3329',
        name: 'Ostatní záležitosti ochrany památek a péče o kulturní dědictví',
      },
      {
        id: '3330',
        name: 'Činnosti registrovaných církví a náboženských společností',
      },
      {id: '3341', name: 'Rozhlas a televize'},
      {id: '3349', name: 'Ostatní záležitosti sdělovacích prostředků'},
      {
        id: '3361',
        name:
          'Činnost ústředního orgánu státní správy v oblasti kultury a církví',
      },
      {
        id: '3362',
        name:
          'Činnost ostatních orgánů státní správy v oblasti kultury, církví a sdělovacích prostředků',
      },
      {
        id: '3369',
        name:
          'Ostatní správa v oblasti kultury, církví a sdělovacích prostředků',
      },
      {
        id: '3380',
        name:
          'Výzkum a vývoj v oblasti kultury, církví a sdělovacích prostředků',
      },
      {
        id: '3391',
        name:
          'Mezinárodní spolupráce v kultuře, církvích a sdělovacích prostředcích',
      },
      {id: '3392', name: 'Zájmová činnost v kultuře'},
      {
        id: '3399',
        name: 'Ostatní záležitosti kultury, církví a sdělovacích prostředků',
      },
      {id: '3411', name: 'Státní sportovní reprezentace'},
      {id: '3412', name: 'Sportovní zařízení v majetku obcí'},
      {id: '3419', name: 'Ostatní tělovýchovná činnost'},
      {id: '3421', name: 'Využití volného času dětí a mládeže'},
      {id: '3429', name: 'Ostatní zájmová činnost a rekreace'},
      {
        id: '3480',
        name: 'Výzkum v oblasti tělovýchovy, zájmové činnosti a rekreace',
      },
      {id: '3511', name: 'Všeobecná ambulantní péče'},
      {id: '3512', name: 'Stomatologická péče'},
      {id: '3513', name: 'Lékařská služba první pomoci'},
      {id: '3514', name: 'Transfúzní služba a tkáňová zařízení'},
      {id: '3515', name: 'Specializovaná ambulantní zdravotní péče'},
      {id: '3516', name: 'Péče v mateřství'},
      {id: '3519', name: 'Ostatní ambulantní péče'},
      {id: '3521', name: 'Fakultní nemocnice'},
      {id: '3522', name: 'Ostatní nemocnice'},
      {id: '3523', name: 'Odborné léčebné ústavy'},
      {id: '3524', name: 'Léčebny dlouhodobě nemocných'},
      {id: '3525', name: 'Hospice'},
      {id: '3526', name: 'Lázeňské léčebny, ozdravovny, sanatoria'},
      {
        id: '3527',
        name:
          'Vysoce specializovaná pracoviště a jednooborové zařízení lůžkové péče',
      },
      {id: '3529', name: 'Ostatní ústavní péče'},
      {id: '3531', name: 'Hygienická služba a ochrana veřejného zdraví'},
      {
        id: '3532',
        name:
          'Lékárenská služba (léky, protézy a přístroje pro užití vně zdravotnických zařízení)',
      },
      {id: '3533', name: 'Zdravotnická záchranná služba'},
      {id: '3534', name: 'Doprava ve zdravotnictví'},
      {
        id: '3539',
        name: 'Ostatní zdravotnická zařízení a služby pro zdravotnictví',
      },
      {
        id: '3541',
        name: 'Prevence před drogami, alkoholem, nikotinem aj. závislostmi',
      },
      {id: '3542', name: 'Prevence HIV/AIDS'},
      {id: '3543', name: 'Pomoc zdravotně postiženým a chronicky nemocným'},
      {id: '3544', name: 'Národní program zdraví'},
      {id: '3545', name: 'Programy paliativní péče'},
      {id: '3549', name: 'Ostatní speciální zdravotnická péče'},
      {
        id: '3561',
        name: 'Činnost ústředního orgánu státní správy ve zdravotnictví',
      },
      {
        id: '3562',
        name: 'Činnost ostatních orgánů státní správy ve zdravotnictví',
      },
      {id: '3569', name: 'Ostatní správa ve zdravotnictví jinde nezařazená'},
      {id: '3581', name: 'Organizace výzkumu a střediska vědeckých informací'},
      {id: '3589', name: 'Ostatní výzkum a vývoj ve zdravotnictví'},
      {id: '3591', name: 'Mezinárodní spolupráce ve zdravotnictví'},
      {id: '3592', name: 'Další vzdělávání pracovníků ve zdravotnictví'},
      {id: '3599', name: 'Ostatní činnost ve zdravotnictví'},
      {id: '3611', name: 'Podpora individuální bytové výstavby'},
      {id: '3612', name: 'Bytové hospodářství'},
      {id: '3613', name: 'Nebytové hospodářství'},
      {id: '3614', name: 'Bytové služby pro vlastní zaměstnance'},
      {id: '3615', name: 'Podpora stavebního spoření a hypotečních úvěrů'},
      {id: '3619', name: 'Ostatní rozvoj bydlení a bytového hospodářství'},
      {id: '3631', name: 'Veřejné osvětlení'},
      {id: '3632', name: 'Pohřebnictví'},
      {id: '3633', name: 'Výstavba a údržba místních inženýrských sítí'},
      {id: '3634', name: 'Lokální zásobování teplem'},
      {id: '3635', name: 'Územní plánování'},
      {id: '3636', name: 'Územní rozvoj'},
      {id: '3639', name: 'Komunální služby a územní rozvoj jinde nezařazené'},
      {
        id: '3661',
        name:
          'Činnost ústředního orgánu státní správy v oblasti bydlení, komunálních služeb a územního rozvoje',
      },
      {
        id: '3662',
        name:
          'Činnost ostatních orgánů státní správy v oblasti bydlení, komunálních služeb a územního rozvoje',
      },
      {
        id: '3669',
        name:
          'Ostatní správa v oblasti v oblasti bydlení, komunálních služeb a územního rozvoje jinde nezařazená',
      },
      {
        id: '3680',
        name:
          'Výzkum a vývoj v oblasti bydlení, komunálních služeb a územního rozvoje',
      },
      {
        id: '3691',
        name:
          'Mezinárodní spolupráce v oblasti bydlení, komunálních služeb a územního rozvoje',
      },
      {
        id: '3699',
        name:
          'Ostatní záležitosti bydlení, komunálních služeb a územního rozvoje',
      },
      {id: '3711', name: 'Odstraňování tuhých emisí'},
      {id: '3712', name: 'Odstraňování plynných emisí'},
      {id: '3713', name: 'Změny technologií vytápění'},
      {
        id: '3714',
        name:
          'Opatření ke snižování produkce skleníkových plynů a plynů poškozujících ozónovou vrstvu',
      },
      {
        id: '3715',
        name:
          'Změny výrobních technologií za účelem výrazného odstranění emisí',
      },
      {id: '3716', name: 'Monitoring ochrany ovzduší'},
      {id: '3719', name: 'Ostatní činnosti k ochraně ovzduší'},
      {id: '3721', name: 'Sběr a svoz nebezpečných odpadů'},
      {id: '3722', name: 'Sběr a svoz komunálních odpadů'},
      {
        id: '3723',
        name:
          'Sběr a svoz ostatních odpadů (jiných než nebezpečných a komunálních)',
      },
      {id: '3724', name: 'Využívání a zneškodňování nebezpečných odpadů'},
      {id: '3725', name: 'Využívání a zneškodňování komunálních odpadů'},
      {id: '3726', name: 'Využívání a zneškodňování ostatních odpadů'},
      {id: '3727', name: 'Prevence vzniku odpadů'},
      {id: '3728', name: 'Monitoring nakládání s odpady'},
      {id: '3729', name: 'Ostatní nakládání s odpady'},
      {
        id: '3731',
        name: 'Ochrana půdy a podzemní vody proti znečišťujícím infiltracím',
      },
      {id: '3732', name: 'Dekontaminace půd a čištění spodní vody'},
      {id: '3733', name: 'Monitoring půdy a podzemní vody'},
      {id: '3734', name: 'Předcházení a sanace zasolení půd'},
      {id: '3739', name: 'Ostatní ochrana půdy a spodní vody'},
      {id: '3741', name: 'Ochrana druhů a stanovišť'},
      {id: '3742', name: 'Chráněné části přírody'},
      {
        id: '3743',
        name:
          'Rekultivace půdy v důsledku těžební a důlní činnosti, po skládkách odpadů apod.',
      },
      {id: '3744', name: 'Protierozní, protilavinová a protipožární ochrana'},
      {id: '3745', name: 'Péče o vzhled obcí a veřejnou zeleň'},
      {id: '3749', name: 'Ostatní činnosti k ochraně přírody a krajiny'},
      {
        id: '3751',
        name:
          'Konstrukce a uplatnění protihlukových zařízení (protihlukové stěny a bariéry, okna, zapouzdření strojů apod.)',
      },
      {id: '3753', name: 'Monitoring ke zjišťování úrovně hluku a vibrací'},
      {id: '3759', name: 'Ostatní činnosti k omezení hluku a vibrací'},
      {
        id: '3761',
        name:
          'Činnost ústředního orgánu státní správy v ochraně životního prostředí',
      },
      {
        id: '3762',
        name:
          'Činnost ostatních orgánů státní správy v ochraně životního prostředí',
      },
      {id: '3769', name: 'Ostatní správa v ochraně životního prostředí'},
      {id: '3771', name: 'Protiradonová opatření'},
      {id: '3772', name: 'Přeprava a nakládání s vysoce radioaktivním odpadem'},
      {
        id: '3773',
        name: 'Monitoring k zajišťování úrovně radioaktivního záření',
      },
      {id: '3779', name: 'Ostatní činnosti k ochraně proti záření'},
      {id: '3780', name: 'Výzkum životního prostředí'},
      {id: '3791', name: 'Mezinárodní spolupráce v životním prostředí'},
      {id: '3792', name: 'Ekologická výchova a osvěta'},
      {id: '3793', name: 'Ekologie v dopravě'},
      {id: '3799', name: 'Ostatní ekologické záležitosti'},
      {id: '3801', name: 'Akademie věd České republiky'},
      {id: '3802', name: 'Grantová agentura České republiky'},
      {id: '3803', name: 'Technologická agentura České republiky'},
      {id: '3809', name: 'Ostatní výzkum a vývoj odvětvově nespecifikovaný'},
      {
        id: '3900',
        name: 'Ostatní činnosti související se službami pro obyvatelstvo',
      },
      {id: '4111', name: 'Starobní důchody'},
      {id: '4112', name: 'Invalidní důchody pro invaliditu třetího stupně'},
      {id: '4113', name: 'Invalidní důchody pro invaliditu druhého stupně'},
      {id: '4114', name: 'Vdovské důchody'},
      {id: '4115', name: 'Vdovecké důchody'},
      {id: '4116', name: 'Sirotčí důchody'},
      {id: '4117', name: 'Invalidní důchody pro invaliditu prvního stupně'},
      {id: '4119', name: 'Ostatní dávky důchodového pojištění'},
      {id: '4121', name: 'Nemocenské'},
      {id: '4122', name: 'Ošetřovné'},
      {id: '4123', name: 'Vyrovnávací příspěvek v těhotenství a mateřství'},
      {id: '4124', name: 'Peněžitá pomoc v mateřství'},
      {id: '4129', name: 'Dávky nemocenského pojištění jinde nezařazené'},
      {id: '4131', name: 'Přídavek na dítě'},
      {id: '4132', name: 'Sociální příplatek'},
      {id: '4133', name: 'Porodné'},
      {id: '4134', name: 'Rodičovský příspěvek'},
      {id: '4136', name: 'Dávky pěstounské péče'},
      {id: '4138', name: 'Pohřebné'},
      {id: '4141', name: 'Příspěvek na bydlení'},
      {id: '4142', name: 'Příspěvek na školní pomůcky'},
      {id: '4149', name: 'Dávky státní sociální podpory jinde nezařazené'},
      {id: '4151', name: 'Odchodné'},
      {id: '4152', name: 'Výsluhový příspěvek'},
      {id: '4153', name: 'Úmrtné a příspěvek na pohřeb příslušníka'},
      {id: '4154', name: 'Odbytné'},
      {
        id: '4159',
        name:
          'Ostatní sociální dávky příslušníků ozbrojených sil při skončení služebního poměru',
      },
      {id: '4161', name: 'Úrazový příplatek'},
      {id: '4162', name: 'Úrazové vyrovnání'},
      {id: '4163', name: 'Bolestné'},
      {id: '4164', name: 'Příspěvek za ztížení společenského uplatnění'},
      {id: '4165', name: 'Náhrada nákladů spojených s léčením'},
      {id: '4166', name: 'Náhrada nákladů spojených s pohřbem'},
      {id: '4167', name: 'Jednorázový příspěvek pozůstalému'},
      {id: '4168', name: 'Úrazová renta pozůstalého'},
      {id: '4169', name: 'Ostatní dávky úrazového pojištění'},
      {id: '4171', name: 'Příspěvek na živobytí'},
      {id: '4172', name: 'Doplatek na bydlení'},
      {id: '4173', name: 'Mimořádná okamžitá pomoc'},
      {
        id: '4177',
        name: 'Mimořádná okamžitá pomoc osobám ohroženým sociálním vyloučením',
      },
      {id: '4179', name: 'Ostatní dávky sociální pomoci'},
      {id: '4182', name: 'Příspěvek na zvláštní pomůcky'},
      {id: '4183', name: 'Příspěvek na úpravu a provoz bezbariérového bytu'},
      {
        id: '4184',
        name:
          'Příspěvky na zakoupení, opravu a zvláštní úpravu motorového vozidla',
      },
      {id: '4185', name: 'Příspěvek na provoz motorového vozidla'},
      {id: '4186', name: 'Příspěvek na individuální dopravu'},
      {id: '4187', name: 'Příspěvek na mobilitu'},
      {id: '4188', name: 'Příspěvek na zvláštní pomůcku'},
      {id: '4189', name: 'Ostatní dávky zdravotně postiženým občanům'},
      {id: '4191', name: 'Státní příspěvky na důchodové připojištění'},
      {id: '4192', name: 'Úrokové příspěvky mladým manželstvím'},
      {
        id: '4193',
        name: 'Dávky a odškodnění válečným veteránům a perzekvovaným osobám',
      },
      {id: '4194', name: 'Zvýšení důchodů pro bezmocnost'},
      {id: '4195', name: 'Příspěvek na péči'},
      {
        id: '4199',
        name: 'Ostatní dávky povahy sociálního zabezpečení jinde nezařazené',
      },
      {id: '4210', name: 'Podpory v nezaměstnanosti'},
      {id: '4221', name: 'Rekvalifikace'},
      {id: '4222', name: 'Veřejně prospěšné práce'},
      {id: '4223', name: 'Společensky účelná pracovní místa'},
      {id: '4225', name: 'Podpora zaměstnanosti zdravotně postižených občanů'},
      {id: '4226', name: 'Ostatní podpora zaměstnanosti'},
      {id: '4227', name: 'Cílené programy k řešení zaměstnanosti'},
      {id: '4229', name: 'Aktivní politika zaměstnanosti jinde nezařazená'},
      {
        id: '4230',
        name: 'Ochrana zaměstnanců při platební neschopnosti zaměstnavatelů',
      },
      {
        id: '4240',
        name:
          'Příspěvek zaměstnavatelům zaměstnávajícím více než 50% občanů se změněnou pracovní schopností',
      },
      {id: '4250', name: 'Příspěvky na sociální důsledky restrukturalizace'},
      {id: '4280', name: 'Výzkum a vývoj v politice zaměstnanosti'},
      {id: '4311', name: 'Základní sociální poradenství'},
      {id: '4312', name: 'Odborné sociální poradenství'},
      {
        id: '4319',
        name: 'Ostatní výdaje související se sociálním poradenstvím',
      },
      {id: '4324', name: 'Zařízení pro děti vyžadující okamžitou pomoc'},
      {id: '4329', name: 'Ostatní sociální péče a pomoc dětem a mládeži'},
      {id: '4333', name: 'Domovy-penzióny pro matky s dětmi'},
      {id: '4334', name: 'Pečovatelská služba pro rodinu a děti'},
      {id: '4339', name: 'Ostatní sociální péče a pomoc rodině a manželství'},
      {
        id: '4341',
        name:
          'Sociální pomoc osobám v hmotné nouzi a občanům sociálně nepřizpůsobivým',
      },
      {
        id: '4342',
        name: 'Sociální péče a pomoc přistěhovalcům a vybraným etnikům',
      },
      {
        id: '4343',
        name:
          'Sociální pomoc osobám v souvislosti s živelní pohromou nebo požárem',
      },
      {id: '4344', name: 'Sociální poradenství pro staré občany'},
      {id: '4345', name: 'Centra sociálně rehabilitačních služeb'},
      {
        id: '4349',
        name: 'Ostatní sociální péče a pomoc ostatním skupinám obyvatelstva',
      },
      {id: '4350', name: 'Domovy pro seniory'},
      {
        id: '4351',
        name:
          'Osobní asistence, pečovatelská služba a podpora samostatného bydlení',
      },
      {id: '4352', name: 'Tísňová péče'},
      {id: '4353', name: 'Průvodcovské a předčitatelské služby'},
      {id: '4354', name: 'Chráněné bydlení'},
      {id: '4355', name: 'Týdenní stacionáře'},
      {id: '4356', name: 'Denní stacionáře a centra denních služeb'},
      {
        id: '4357',
        name:
          'Domovy pro osoby se zdravotním postižením a domovy se zvláštním režimem',
      },
      {
        id: '4358',
        name:
          'Sociální služby poskytované ve zdravotnických zařízeních ústavní péče',
      },
      {id: '4359', name: 'Ostatní služby a činnosti v oblasti sociální péče'},
      {
        id: '4361',
        name:
          'Činnost ústředního orgánu státní správy v sociálním zabezpečení, politice zaměstnanosti a rodinné politice',
      },
      {
        id: '4362',
        name: 'Činnost ostatních orgánů státní správy v sociálním zabezpečení',
      },
      {
        id: '4363',
        name: 'Ostatní orgány státní správy v oblasti politiky zaměstnanosti',
      },
      {
        id: '4369',
        name: 'Ostatní správa v sociálním zabezpečení a politice zaměstnanosti',
      },
      {
        id: '4371',
        name: 'Raná péče a sociálně aktivizační služby pro rodiny s dětmi',
      },
      {id: '4372', name: 'Krizová pomoc'},
      {id: '4373', name: 'Domy na půl cesty'},
      {
        id: '4374',
        name: 'Azylové domy, nízkoprahová denní centra a noclehárny',
      },
      {id: '4375', name: 'Nízkoprahová zařízení pro děti a mládež'},
      {
        id: '4376',
        name: 'Služby následné péče, terapeutické komunity a kontaktní centra',
      },
      {id: '4377', name: 'Sociálně terapeutické dílny'},
      {id: '4378', name: 'Terénní programy'},
      {
        id: '4379',
        name: 'Ostatní služby a činnosti v oblasti sociální prevence',
      },
      {
        id: '4380',
        name: 'Výzkum v sociálním zabezpečení a politice zaměstnanosti',
      },
      {
        id: '4391',
        name:
          'Mezinárodní spolupráce v sociálním zabezpečení a podpoře zaměstnanosti',
      },
      {id: '4392', name: 'Inspekce poskytování sociálních služeb'},
      {
        id: '4399',
        name: 'Ostatní záležitosti sociálních věcí a politiky zaměstnanosti',
      },
      {id: '5111', name: 'Armáda'},
      {id: '5112', name: 'Ostatní ozbrojené síly'},
      {id: '5113', name: 'Bezpečnostní složky ozbrojených sil'},
      {id: '5119', name: 'Podpůrné složky ozbrojených sil'},
      {
        id: '5161',
        name: 'Činnost ústředního orgánu státní správy ve vojenské obraně',
      },
      {
        id: '5162',
        name: 'Činnost ostatních orgánů státní správy ve vojenské obraně',
      },
      {id: '5169', name: 'Ostatní správa ve vojenské obraně'},
      {id: '5171', name: 'Zabezpečení potřeb ozbrojených sil'},
      {id: '5172', name: 'Operační příprava státního území'},
      {
        id: '5179',
        name: 'Ostatní činnosti pro zabezpečení potřeb ozbrojených sil',
      },
      {id: '5180', name: 'Výzkum a vývoj v oblasti obrany'},
      {id: '5191', name: 'Mezinárodní spolupráce v obraně'},
      {id: '5192', name: 'Zahraniční vojenská pomoc'},
      {id: '5199', name: 'Ostatní záležitosti obrany'},
      {id: '5211', name: 'Civilní ochrana-vojenská část'},
      {id: '5212', name: 'Ochrana obyvatelstva'},
      {id: '5219', name: 'Ostatní záležitosti ochrany obyvatelstva'},
      {id: '5220', name: 'Hospodářská opatření pro krizové stavy'},
      {
        id: '5261',
        name:
          'Státní správa v oblasti hospodářských opatření pro krizové stavy a v oblasti krizového řízení',
      },
      {
        id: '5262',
        name:
          'Činnost ostatních orgánů státní správy v oblasti civilního nouzového hospodářství',
      },
      {
        id: '5269',
        name:
          'Ostatní správa v oblasti hospodářských opatření pro krizové stavy',
      },
      {
        id: '5271',
        name:
          'Činnost orgánů krizového řízení na ústřední úrovni a dalších správních úřadů v oblasti krizového řízení',
      },
      {
        id: '5272',
        name:
          'Činnost orgánů krizového řízení na územní úrovni a dalších územních správních úřadů v oblasti krizového řízení',
      },
      {id: '5273', name: 'Ostatní správa v oblasti krizového řízení'},
      {id: '5274', name: 'Podpora krizového řízení a nouzového plánování'},
      {id: '5279', name: 'Záležitosti krizového řízení jinde nezařazené'},
      {id: '5281', name: 'Výzkum a vývoj v oblasti ochrany obyvatelstva'},
      {id: '5289', name: 'Výzkum a vývoj v oblasti krizového řízení'},
      {id: '5291', name: 'Mezinárodní spolupráce v oblasti krizového řízení'},
      {
        id: '5292',
        name: 'Poskytnutí vzájemné zahraniční pomoci podle mezinárodních smluv',
      },
      {
        id: '5299',
        name: 'Ostatní záležitosti civilní připravenosti na krizové stavy',
      },
      {id: '5311', name: 'Bezpečnost a veřejný pořádek'},
      {
        id: '5316',
        name:
          'Činnost ústředního orgánu státní správy v oblasti bezpečnosti a veřejného pořádku',
      },
      {id: '5317', name: 'Hraniční přechody'},
      {id: '5319', name: 'Ostatní záležitosti bezpečnosti a veřejného pořádku'},
      {id: '5380', name: 'Výzkum týkající se bezpečnosti a veřejného pořádku'},
      {
        id: '5391',
        name:
          'Mezinárodní spolupráce v oblasti bezpečnosti a veřejného pořádku',
      },
      {id: '5399', name: 'Ostatní záležitosti bezpečnosti,veřejného pořádku'},
      {id: '5410', name: 'Ústavní soud'},
      {id: '5420', name: 'Soudy'},
      {id: '5430', name: 'Státní zastupitelství'},
      {
        id: '5441',
        name: 'Činnost Generálního ředitelství Vězeňské služby a věznic',
      },
      {id: '5442', name: 'Ostatní správa ve vězeňství'},
      {id: '5449', name: 'Ostatní záležitosti vězeňství'},
      {id: '5450', name: 'Činnost probační a mediační služby'},
      {
        id: '5461',
        name:
          'Činnost ústředního orgánu státní správy v oblasti právní ochrany',
      },
      {
        id: '5462',
        name: 'Činnost ostatních orgánů státní správy v oblasti právní ochrany',
      },
      {id: '5469', name: 'Ostatní správa v oblasti právní ochrany'},
      {id: '5470', name: 'Kancelář Veřejného ochránce práv'},
      {id: '5471', name: 'Kancelář finančního arbitra'},
      {id: '5480', name: 'Výzkum v oblasti právní ochrany'},
      {id: '5491', name: 'Mezinárodní spolupráce v oblasti právní ochrany'},
      {id: '5499', name: 'Ostatní záležitosti právní ochrany'},
      {id: '5511', name: 'Požární ochrana - profesionální část'},
      {id: '5512', name: 'Požární ochrana - dobrovolná část'},
      {id: '5517', name: 'Vzdělávací a technická zařízení požární ochrany'},
      {id: '5519', name: 'Ostatní záležitosti požární ochrany'},
      {
        id: '5521',
        name:
          'Operační a informační střediska integrovaného záchranného systému.',
      },
      {id: '5522', name: 'Ostatní činnosti v integrovaném záchranném systému'},
      {
        id: '5529',
        name: 'Ostatní složky a činnosti integrovaného záchranného systému',
      },
      {
        id: '5561',
        name: 'Činnost ústředního orgánu státní správy v požární ochraně',
      },
      {
        id: '5562',
        name:
          'Činnost ústředních orgánů státní správy v integrovaném záchranném systému',
      },
      {
        id: '5563',
        name:
          'Činnost ostatních orgánů státní správy v integrovaném záchranném systému',
      },
      {
        id: '5580',
        name:
          'Výzkum a vývoj v požární ochraně a integrovaném záchranném systému',
      },
      {
        id: '5591',
        name:
          'Mezinárodní spolupráce v oblasti požární ochrany a integrovaném záchranném systému',
      },
      {
        id: '5592',
        name: 'Poskytnutí vzájemné zahraniční pomoci podle mezinárodních smluv',
      },
      {
        id: '5599',
        name:
          'Ostatní záležitosti požární ochrany a integrovaného záchranného systému',
      },
      {id: '6111', name: 'Parlament'},
      {id: '6112', name: 'Zastupitelstva obcí'},
      {id: '6113', name: 'Zastupitelstva krajů'},
      {id: '6114', name: 'Volby do Parlamentu ČR'},
      {
        id: '6115',
        name: 'Volby do zastupitelstev územních samosprávných celků',
      },
      {id: '6116', name: 'Celostátní referendum'},
      {id: '6117', name: 'Volby do Evropského parlamentu'},
      {id: '6118', name: 'Volba prezidenta republiky'},
      {id: '6119', name: 'Ostatní zastupitelské orgány a volby'},
      {id: '6120', name: 'Kancelář prezidenta republiky'},
      {id: '6130', name: 'Nejvyšší kontrolní úřad'},
      {
        id: '6141',
        name:
          'Ústřední orgány vnitřní státní správy a jejich dislokovaná pracoviště (nezařazené v jiných funkcích)',
      },
      {id: '6142', name: 'Finanční správa'},
      {id: '6143', name: 'Celní správa'},
      {id: '6145', name: 'Úřad vlády'},
      {id: '6146', name: 'Český statistický úřad'},
      {id: '6148', name: 'Plánování a statistika'},
      {id: '6149', name: 'Ostatní všeobecná vnitřní správa jinde nezařazená'},
      {
        id: '6151',
        name: 'Činnost ústředního orgánu státní správy v zahraniční službě',
      },
      {id: '6152', name: 'Zastupitelství a stálé mise ČR v zahraničí'},
      {id: '6153', name: 'Ostatní účast v mezinárodních vládních organizacích'},
      {id: '6159', name: 'Zahraniční služba a záležitosti jinde nezařazené'},
      {id: '6171', name: 'Činnost místní správy'},
      {id: '6172', name: 'Činnost regionální správy'},
      {id: '6173', name: 'Místní referendum'},
      {id: '6174', name: 'Činnost regionálních rad'},
      {id: '6180', name: 'Výzkum ve státní správě a samosprávě'},
      {id: '6190', name: 'Politické strany a hnutí'},
      {id: '6211', name: 'Archivní činnost'},
      {id: '6219', name: 'Ostatní veřejné služby jinde nezařazené.'},
      {id: '6221', name: 'Humanitární zahraniční pomoc přímá'},
      {id: '6222', name: 'Rozvojová zahraniční pomoc'},
      {id: '6223', name: 'Mezinárodní spolupráce (jinde nezařazená)'},
      {
        id: '6224',
        name:
          'Humanitární zahraniční pomoc poskytovaná prostřednictvím mezinárodních organizací',
      },
      {id: '6229', name: 'Ostatní zahraniční pomoc'},
      {id: '6310', name: 'Obecné příjmy a výdaje z finančních operací'},
      {id: '6320', name: 'Pojištění funkčně nespecifikované'},
      {id: '6330', name: 'Převody vlastním fondům v rozpočtech územní úrovně'},
      {id: '6391', name: 'Soudní a mimosoudní rehabilitace'},
      {id: '6399', name: 'Ostatní finanční operace'},
      {id: '6401', name: 'Transfery všeobecné povahy jiným úrovním vlády'},
      {id: '6402', name: 'Finanční vypořádání minulých let'},
      {id: '6409', name: 'Ostatní činnosti jinde nezařazené'},
    ],
  },
  {
    name: 'items',
    data: [
      {
        id: '5028',
        name: 'Kázeňské odměny poskytnuté formou peněžitých darů',
        validFrom: '2018-01-24T00:00:00.000Z',
      },
      {
        id: '5061',
        name: 'Mzdy podle cizího práva',
        validFrom: '2018-01-24T00:00:00.000Z',
      },
      {
        id: '5123',
        name: 'Podlimitní technické zhodnocení',
        validFrom: '2018-01-24T00:00:00.000Z',
      },
      {
        id: '5185',
        name: 'Převody do elektronických peněženek',
        validFrom: '2018-01-24T00:00:00.000Z',
      },
      {
        id: '5495',
        name: 'Stabilizační příspěvek vojákům',
        validFrom: '2018-01-24T00:00:00.000Z',
      },
      {
        id: '5496',
        name: 'Služební příspěvek vojákům na bydlení',
        validFrom: '2018-01-24T00:00:00.000Z',
      },
      {
        id: '5497',
        name: 'Náborový příspěvek',
        validFrom: '2018-01-24T00:00:00.000Z',
      },
      {
        id: '5498',
        name: 'Kvalifikační příspěvek a jednorázová peněžní výpomoc vojákům',
        validFrom: '2018-01-24T00:00:00.000Z',
      },
      {
        id: '2391',
        name: 'Dočasné zatřídění příjmů',
        validFrom: '2013-09-01T00:00:00.000Z',
      },
      {
        id: '5991',
        name: 'Dočasné zatřídění výdajů',
        validFrom: '2013-09-01T00:00:00.000Z',
      },
      {
        id: '1356',
        name: 'Příjmy úhrad za dobývání nerostů a poplatků za geologické práce',
        validFrom: '2017-01-01T00:00:00.000Z',
      },
      {
        id: '1381',
        name: 'Daň z hazardních her',
        validFrom: '2017-01-01T00:00:00.000Z',
      },
      {
        id: '1382',
        name:
          'Zrušený odvod z loterií a podobných her kromě z výherních hracích přístrojů',
        validFrom: '2017-01-01T00:00:00.000Z',
      },
      {
        id: '1383',
        name: 'Zrušený odvod z výherních hracích přístrojů',
        validFrom: '2017-01-01T00:00:00.000Z',
      },
      {
        id: '1384',
        name: 'Zrušený odvod za státní dozor',
        validFrom: '2017-01-01T00:00:00.000Z',
      },
      {
        id: '4140',
        name: 'Převody z vlastních fondů přes rok',
        validFrom: '2017-01-01T00:00:00.000Z',
      },
      {
        id: '5122',
        name: 'Podlimitní věcná břemena',
        validFrom: '2017-01-01T00:00:00.000Z',
      },
      {
        id: '5350',
        name: 'Převody do vlastních fondů přes rok',
        validFrom: '2017-01-01T00:00:00.000Z',
      },
      {
        id: '5516',
        name: 'Odvody Evropské unii ke krytí záporných úroků',
        validFrom: '2017-01-01T00:00:00.000Z',
      },
      {
        id: '5541',
        name: 'Členské příspěvky mezinárodním vládním organizacím',
        validFrom: '2017-01-01T00:00:00.000Z',
      },
      {
        id: '5542',
        name: 'Členské příspěvky mezinárodním nevládním organizacím',
        validFrom: '2017-01-01T00:00:00.000Z',
      },
      {id: '6141', name: 'Právo stavby', validFrom: '2017-01-01T00:00:00.000Z'},
      {
        id: '6142',
        name: 'Nadlimitní věcná břemena',
        validFrom: '2017-01-01T00:00:00.000Z',
      },
      {
        id: '6211',
        name: 'Vklady do nadací',
        validFrom: '2017-01-01T00:00:00.000Z',
      },
      {
        id: '6212',
        name: 'Vklady do nadačních fondů',
        validFrom: '2017-01-01T00:00:00.000Z',
      },
      {
        id: '6213',
        name: 'Vklady do ústavů',
        validFrom: '2017-01-01T00:00:00.000Z',
      },
      {
        id: '6362',
        name: 'Převody investičních prostředků zpět do FKSP',
        validFrom: '2017-01-01T00:00:00.000Z',
      },
      {
        id: '1228',
        name: 'Spotřební daň ze surového tabáku',
        validFrom: '2016-01-01T00:00:00.000Z',
      },
      {
        id: '4138',
        name: 'Převody z vlastní pokladny',
        validFrom: '2016-01-01T00:00:00.000Z',
      },
      {
        id: '5348',
        name: 'Převody do vlastní pokladny',
        validFrom: '2016-01-01T00:00:00.000Z',
      },
      {
        id: '2125',
        name: 'Převody z fondů státních podniků do státního rozpočtu',
        validFrom: '2015-01-01T00:00:00.000Z',
      },
      {
        id: '2140',
        name:
          'Neúrokové příjmy z finančních derivátů kromě k vlastním dluhopisům',
        validFrom: '2015-01-01T00:00:00.000Z',
      },
      {
        id: '4137',
        name:
          'Převody mezi statutárními městy (hl.m. Prahou) a jejich městskými obvody nebo částmi - příjmy',
        validFrom: '2015-01-01T00:00:00.000Z',
      },
      {
        id: '5148',
        name:
          'Neúrokové výdaje na finanční deriváty kromě k vlastním dluhopisům',
        validFrom: '2015-01-01T00:00:00.000Z',
      },
      {
        id: '5347',
        name:
          'Převody mezi statutárními městy (hl.m.Prahou) a jejich městskými obvody nebo částmi - výdaje',
        validFrom: '2015-01-01T00:00:00.000Z',
      },
      {
        id: '2148',
        name:
          'Úrokové příjmy z finančních derivátů kromě k vlastním dluhopisům',
        validFrom: '2014-01-01T00:00:00.000Z',
      },
      {
        id: '2513',
        name:
          'Podíl na DPH z telekomunikačních a podobných služeb spravované pro EU',
        validFrom: '2014-01-01T00:00:00.000Z',
      },
      {
        id: '5042',
        name: 'Odměny za užití počítačových programů',
        validFrom: '2014-01-01T00:00:00.000Z',
      },
      {
        id: '5147',
        name: 'Úrokové výdaje na finanční deriváty kromě k vlastním dluhopisům',
        validFrom: '2014-01-01T00:00:00.000Z',
      },
      {
        id: '5198',
        name: 'Finanční náhrady v rámci majetkového vyrovnání s církvemi',
        validFrom: '2014-01-01T00:00:00.000Z',
      },
      {
        id: '5425',
        name:
          'Příspěvek na náklady pohřbu dárce orgánu a náhrada poskytovaná žijícímu dárci',
        validFrom: '2014-01-01T00:00:00.000Z',
      },
      {
        id: '8413',
        name: 'Krátkodobé přijaté půjčené prostředky',
        validFrom: '2014-01-01T00:00:00.000Z',
      },
      {
        id: '8414',
        name: 'Uhrazené splátky krátkodobých přijatých půjčených prostředků',
        validFrom: '2014-01-01T00:00:00.000Z',
      },
      {
        id: '4155',
        name: 'Neinvestiční transfery z finančních mechanismů',
        validFrom: '2013-01-01T00:00:00.000Z',
      },
      {
        id: '4156',
        name: 'Neinvestiční transfery od NATO',
        validFrom: '2013-01-01T00:00:00.000Z',
      },
      {
        id: '4234',
        name: 'Investiční transfery z finančních mechanismů',
        validFrom: '2013-01-01T00:00:00.000Z',
      },
      {
        id: '4235',
        name: 'Investiční transfery od NATO',
        validFrom: '2013-01-01T00:00:00.000Z',
      },
      {
        id: '8116',
        name:
          'Změny stavu bankovních účtů krátkodobých prostředků státních finančních aktiv, které  tvoří kapitolu OSFA',
        validFrom: '2013-01-01T00:00:00.000Z',
      },
      {
        id: '8216',
        name:
          'Změna stavu bankovních účtů krátkodobých prostředků z dlouhodobých úvěrů ze zahraničí',
        validFrom: '2013-01-01T00:00:00.000Z',
      },
      {
        id: '8301',
        name: 'Převody ve vztahu k úvěrům od Evropské investiční banky',
        validFrom: '2013-01-01T00:00:00.000Z',
      },
      {
        id: '8302',
        name:
          'Operace na bankovních účtech státních finančních aktiv, které tvoří kapitolu OSFA',
        validFrom: '2013-01-01T00:00:00.000Z',
      },
      {
        id: '8417',
        name:
          'Krátkodobé aktivní financování z jaderného účtu a účtu rezervy důchodového pojištění - příjmy',
        validFrom: '2013-01-01T00:00:00.000Z',
      },
      {
        id: '8418',
        name:
          'Krátkodobé aktivní financování z jaderného účtu a účtu rezervy důchodového pojištění - výdaje',
        validFrom: '2013-01-01T00:00:00.000Z',
      },
      {
        id: '8427',
        name:
          'Dlouhodobé aktivní financování z jaderného účtu a účtu rezervy důchodového pojištění - příjmy',
        validFrom: '2013-01-01T00:00:00.000Z',
      },
      {
        id: '8428',
        name:
          'Dlouhodobé aktivní financování z jaderného účtu a účtu rezervy důchodového pojištění - výdaje',
        validFrom: '2013-01-01T00:00:00.000Z',
      },
      {
        id: '1340',
        name:
          'Poplatek za provoz systému shromažďování, sběru, přepravy, třídění, využívání a odstraňování komunálních odpadů',
        validFrom: '2012-01-01T00:00:00.000Z',
      },
      {
        id: '1371',
        name: 'Poplatek na činnost Energetického regulačního úřadu',
        validFrom: '2012-01-01T00:00:00.000Z',
      },
      {
        id: '1372',
        name:
          'Poplatek Státnímu úřadu pro jadernou bezpečnost za žádost o vydání povolení',
        validFrom: '2012-01-01T00:00:00.000Z',
      },
      {
        id: '1373',
        name: 'Udržovací poplatek Státnímu úřadu pro jadernou bezpečnost',
        validFrom: '2012-01-01T00:00:00.000Z',
      },
      {
        id: '2146',
        name: 'Úrokové příjmy z finančních derivátů k vlastním dluhopisům',
        validFrom: '2012-01-01T00:00:00.000Z',
      },
      {
        id: '2147',
        name: 'Neúrokové příjmy z finančních derivátů k vlastním dluhopisům',
        validFrom: '2012-01-01T00:00:00.000Z',
      },
      {
        id: '2511',
        name: 'Podíl na clech',
        validFrom: '2012-01-01T00:00:00.000Z',
      },
      {
        id: '2512',
        name: 'Podíl na dávkách z cukru',
        validFrom: '2012-01-01T00:00:00.000Z',
      },
      {
        id: '5146',
        name: 'Úrokové výdaje na finanční deriváty k vlastním dluhopisům',
        validFrom: '2012-01-01T00:00:00.000Z',
      },
      {
        id: '6356',
        name: 'Jiné investiční transfery zřízeným příspěvkovým organizacím',
        validFrom: '2012-01-01T00:00:00.000Z',
      },
      {
        id: '8300',
        name:
          'Pohyby na účtech pro financování nepatřící na jiné financující položky',
        validFrom: '2012-01-01T00:00:00.000Z',
      },
      {
        id: '8905',
        name:
          'Nepřevedené částky vyrovnávající schodek a saldo státní pokladny',
        validFrom: '2012-01-01T00:00:00.000Z',
      },
      {
        id: '1111',
        name: 'Daň z příjmů fyzických osob placená plátci',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1112',
        name: 'Daň z příjmů fyzických osob placená poplatníky',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1113',
        name: 'Daň z příjmů fyzických osob vybíraná srážkou',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1119',
        name: 'Zrušené daně, jejichž předmětem je příjem fyzických osob',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1121',
        name: 'Daň z příjmů právnických osob',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1122',
        name: 'Daň z příjmů právnických osob za obce',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1123',
        name: 'Daň z příjmů právnických osob za kraje',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1129',
        name: 'Zrušené daně, jejichž předmětem je příjem právnických osob',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1211',
        name: 'Daň z přidané hodnoty',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1219',
        name: 'Zrušené daně ze zboží a služeb',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1221',
        name: 'Spotřební daň z minerálních olejů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1222',
        name: 'Spotřební daň z lihu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1223',
        name: 'Spotřební daň z piva',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1224',
        name: 'Spotřební daň z vína a meziproduktů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1225',
        name: 'Spotřební daň z tabákových výrobků',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1226',
        name:
          'Poplatek za látky poškozující nebo ohrožující ozónovou vrstvu Země',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1227',
        name: 'Audiovizuální poplatky',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1231',
        name: 'Daň ze zemního plynu a některých dalších plynů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1232',
        name: 'Daň z pevných paliv',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1233',
        name: 'Daň z elektřiny',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1234',
        name: 'Odvod z elektřiny ze slunečního záření',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {id: '1321', name: 'Daň silniční', validFrom: '1900-01-01T00:00:00.000Z'},
      {
        id: '1322',
        name: 'Poplatek za užívání dálnic a rychlostních silnic',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1331',
        name: 'Poplatky za vypouštění odpadních vod do vod povrchových',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1332',
        name: 'Poplatky za znečišťování ovzduší',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1333',
        name: 'Poplatky za uložení odpadů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1334',
        name: 'Odvody za odnětí půdy ze zemědělského půdního fondu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1335',
        name: 'Poplatky za odnětí pozemků plnění funkcí lesa',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1336',
        name: 'Poplatek za povolené vypouštění odpadních vod do vod podzemních',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1337',
        name: 'Poplatek za komunální odpad',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1338',
        name: 'Registrační a evidenční poplatky za obaly',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1339',
        name: 'Ostatní poplatky a odvody v oblasti životního prostředí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1341',
        name: 'Poplatek ze psů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1342',
        name: 'Poplatek za lázeňský nebo rekreační pobyt',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1343',
        name: 'Poplatek za užívání veřejného prostranství',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1344',
        name: 'Poplatek ze vstupného',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1345',
        name: 'Poplatek z ubytovací kapacity',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1346',
        name: 'Poplatek za povolení k vjezdu do vybraných míst',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1348',
        name: 'Poplatek za zhodnocení stavebního pozemku',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1349',
        name: 'Zrušené místní poplatky',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1353',
        name:
          'Příjmy za zkoušky z odborné způsobilosti od žadatelů o řidičské oprávnění',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1354',
        name: 'Příjmy z licencí pro kamionovou dopravu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1359',
        name: 'Ostatní odvody z vybraných činností a služeb jinde neuvedené',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1361',
        name: 'Správní poplatky',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {id: '1401', name: 'Clo', validFrom: '1900-01-01T00:00:00.000Z'},
      {
        id: '1409',
        name: 'Zrušené daně z mezinárodního obchodu a transakcí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1511',
        name: 'Daň z nemovitých věcí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {id: '1521', name: 'Daň dědická', validFrom: '1900-01-01T00:00:00.000Z'},
      {id: '1522', name: 'Daň darovací', validFrom: '1900-01-01T00:00:00.000Z'},
      {
        id: '1523',
        name: 'Daň z nabytí nemovitých věcí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1529',
        name: 'Zrušené daně z majetkových a kapitálových převodů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1611',
        name: 'Pojistné na důchodové pojištění od zaměstnavatelů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1612',
        name: 'Pojistné na důchodové pojištění od zaměstnanců',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1613',
        name:
          'Pojistné na důchodové pojištění od osob samostatně výdělečně činných (dále jen "OSVČ")',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1614',
        name: 'Pojistné na nemocenské pojištění od zaměstnavatelů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1615',
        name: 'Pojistné na nemocenské pojištění od zaměstnanců',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1617',
        name: 'Příspěvky na státní politiku zaměstnanosti od zaměstnavatelů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1618',
        name: 'Příspěvky na státní politiku zaměstnanosti od zaměstnanců',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1621',
        name: 'Příspěvky na státní politiku zaměstnanosti od OSVČ',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1627',
        name: 'Přirážky k pojistnému',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1628',
        name: 'Příslušenství pojistného',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1629',
        name:
          'Nevyjasněné, neidentifikované a nezařazené příjmy z pojistného na sociální zabezpečení',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1631',
        name: 'Pojistné na veřejné zdravotní pojištění od zaměstnavatelů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1632',
        name: 'Pojistné na veřejné zdravotní pojištění od zaměstnanců',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1633',
        name: 'Pojistné na veřejné zdravotní pojištění od OSVČ',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1638',
        name: 'Příslušenství pojistného na veřejné zdravotní pojištění',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1691',
        name: 'Zrušené daně a odvody  z objemu mezd',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1701',
        name: 'Nerozúčtované, neidentifikované a nezařaditelné daňové příjmy',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1702',
        name: 'Tržby z prodeje kolků',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1703',
        name:
          'Odvody nahrazující zaměstnávání občanů se změněnou pracovní schopností',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1704',
        name: 'Příslušenství',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '1706',
        name: 'Dávky z cukru',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2111',
        name: 'Příjmy z poskytování služeb a výrobků',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2112',
        name: 'Příjmy z prodeje zboží (již nakoupeného za účelem prodeje)',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2113',
        name: 'Příjmy ze školného',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {id: '2114', name: 'Mýtné', validFrom: '1900-01-01T00:00:00.000Z'},
      {
        id: '2119',
        name: 'Ostatní příjmy z vlastní činnosti',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2121',
        name: 'Odvody přebytků ústřední banky',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2122',
        name: 'Odvody příspěvkových organizací',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2123',
        name: 'Ostatní odvody příspěvkových organizací',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2124',
        name:
          'Odvody školských právnických osob zřízených státem, kraji a obcemi',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2129',
        name: 'Ostatní odvody přebytků organizací s přímým vztahem',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2131',
        name: 'Příjmy z pronájmu pozemků',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2132',
        name: 'Příjmy z pronájmu ostatních nemovitých věcí a jejich částí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2133',
        name: 'Příjmy z pronájmu movitých věcí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2139',
        name: 'Ostatní příjmy z pronájmu majetku',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2141',
        name: 'Příjmy z úroků (část)',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2142',
        name: 'Příjmy z podílů na zisku a dividend',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2143',
        name: 'Kursové rozdíly v příjmech',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2144',
        name: 'Příjmy z úroků ze státních dluhopisů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2145',
        name: 'Příjmy z úroků z komunálních dluhopisů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2149',
        name: 'Ostatní příjmy z výnosů finančního majetku',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2151',
        name: 'Soudní poplatky',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2211',
        name: 'Sankční platby přijaté od státu, obcí a krajů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2212',
        name: 'Sankční platby přijaté od jiných subjektů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2221',
        name: 'Přijaté vratky transferů od jiných veřejných rozpočtů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2222',
        name:
          'Ostatní příjmy z finančního vypořádání předchozích let od jiných veřejných rozpočtů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2223',
        name:
          'Příjmy z finančního vypořádání minulých let mezi krajem a obcemi',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2224',
        name: 'Vratky nevyužitých prostředků z Národního fondu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2225',
        name:
          'Úhrady prostředků vynaložených podle zákona o ochraně zaměstnanců při platební neschopnosti zaměstnavatele',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2226',
        name: 'Příjmy z finančního vypořádání minulých let mezi obcemi',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2227',
        name:
          'Příjmy z finančního vypořádání minulých let mezi regionální radou a kraji, obcemi a dobrovolnými svazky obcí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2229',
        name: 'Ostatní přijaté vratky transferů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2310',
        name: 'Příjmy z prodeje krátkodobého a drobného dlouhodobého majetku',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2321',
        name: 'Přijaté neinvestiční dary',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2322',
        name: 'Přijaté pojistné náhrady',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2324',
        name: 'Přijaté nekapitálové příspěvky a náhrady',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2325',
        name:
          'Vratky prostředků z Národního fondu pro vyrovnání kursových rozdílů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2326',
        name:
          'Vratky prostředků z Národního fondu související s neplněním závazků z mezinárodních smluv',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2327',
        name:
          'Úhrada prostředků, které státní rozpočet odvedl Evropské unii za Národní fond',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2328',
        name: 'Neidentifikované příjmy',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2329',
        name: 'Ostatní nedaňové příjmy jinde nezařazené',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2341',
        name: 'Poplatek za využívání zdroje přírodní minerální vody',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2342',
        name:
          'Platby za odebrané množství podzemní vody a za správu vodních toků',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2343',
        name:
          'Příjmy dobíhajících úhrad z dobývacího prostoru a z vydobytých nerostů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2351',
        name: 'Poplatky za udržování patentu v platnosti',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2352',
        name: 'Poplatky za udržování evropského patentu v platnosti',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2353',
        name:
          'Poplatky za udržování dodatkového ochranného osvědčení pro léčiva',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2361',
        name: 'Pojistné na nemocenské pojištění od OSVČ',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2362',
        name: 'Dobrovolné pojistné na důchodové pojištění',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2411',
        name:
          'Splátky půjčených prostředků od podnikatelských subjektů-fyzických osob',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2412',
        name:
          'Splátky půjčených prostředků od podnikatelských subjektů-právnických  osob',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2413',
        name:
          'Splátky půjčených prostředků od podnikatelských finančních subjektů-právnických osob',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2414',
        name: 'Splátky půjčených prostředků od podniků ve vlastnictví státu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2420',
        name:
          'Splátky půjčených prostředků od obecně prospěšných společností a podobných subjektů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2431',
        name: 'Splátky půjčených prostředků od státního rozpočtu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2432',
        name: 'Splátky půjčených prostředků  od státních fondů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2433',
        name:
          'Splátky půjčených prostředků od zvláštních fondů ústřední úrovně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2434',
        name:
          'Splátky půjčených prostředků  od fondů sociálního a zdravotního pojištění',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2439',
        name: 'Ostatní splátky půjčených prostředků od veřejných rozpočtů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2441',
        name: 'Splátky půjčených prostředků od obcí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2442',
        name: 'Splátky půjčených prostředků od krajů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2443',
        name: 'Splátky půjčených prostředků od regionálních rad',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2449',
        name:
          'Ostatní splátky půjčených prostředků od veřejných rozpočtů územní úrovně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2451',
        name: 'Splátky půjčených prostředků od příspěvkových organizací',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2452',
        name: 'Splátky půjčených prostředků od vysokých škol',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2459',
        name:
          'Splátky půjčených prostředků od ostatních zřízených a podobných subjektů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2460',
        name: 'Splátky půjčených prostředků od obyvatelstva',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2470',
        name: 'Splátky půjčených prostředků ze zahraničí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2481',
        name: 'Příjmy od dlužníků za realizace záruk',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '2482',
        name: 'Splátky od dlužníků za zaplacení dodávek',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '3111',
        name: 'Příjmy z prodeje pozemků',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '3112',
        name: 'Příjmy z prodeje ostatních nemovitých věcí a jejich částí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '3113',
        name: 'Příjmy z prodeje ostatního hmotného dlouhodobého majetku',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '3114',
        name: 'Příjmy z prodeje nehmotného dlouhodobého majetku',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '3119',
        name: 'Ostatní příjmy z prodeje dlouhodobého majetku',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '3121',
        name: 'Přijaté dary na pořízení dlouhodobého majetku',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '3122',
        name: 'Přijaté příspěvky na pořízení dlouhodobého majetku',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '3129',
        name: 'Ostatní investiční příjmy jinde nezařazené',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '3201',
        name: 'Příjmy z prodeje akcií',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '3202',
        name: 'Příjmy z prodeje majetkových podílů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '3203',
        name: 'Příjmy z prodeje dluhopisů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '3209',
        name: 'Ostatní příjmy z prodeje dlouhodobého finančního majetku',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4111',
        name:
          'Neinvestiční přijaté transfery z všeobecné pokladní správy státního rozpočtu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4112',
        name:
          'Neinvestiční přijaté transfery ze státního rozpočtu v rámci souhrnného dotačního vztahu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4113',
        name: 'Neinvestiční přijaté transfery ze státních fondů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4114',
        name:
          'Neinvestiční přijaté transfery ze zvláštních fondů ústřední úrovně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4115',
        name:
          'Neinvestiční přijaté transfery od fondů sociálního a zdravotního pojištění',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4116',
        name: 'Ostatní neinvestiční přijaté transfery ze státního rozpočtu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4118',
        name: 'Neinvestiční převody z Národního fondu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4119',
        name:
          'Ostatní neinvestiční přijaté transfery od rozpočtů ústřední úrovně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4121',
        name: 'Neinvestiční přijaté transfery od obcí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4122',
        name: 'Neinvestiční přijaté transfery od krajů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4123',
        name: 'Neinvestiční přijaté transfery od regionálních rad',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4129',
        name:
          'Ostatní neinvestiční přijaté transfery od rozpočtů územní úrovně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4131',
        name: 'Převody z vlastních fondů hospodářské (podnikatelské) činnosti',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4132',
        name: 'Převody z ostatních vlastních fondů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4133',
        name:
          'Převody z vlastních rezervních fondů (jiných než organizačních složek státu)',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4134',
        name: 'Převody z rozpočtových účtů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4135',
        name: 'Převody z rezervních fondů organizačních složek státu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4136',
        name: 'Převody z jiných fondů organizačních složek státu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4139',
        name: 'Ostatní převody z vlastních fondů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4151',
        name: 'Neinvestiční přijaté transfery od cizích států',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4152',
        name:
          'Neinvestiční přijaté transfery od mezinárodních institucí a některých cizích orgánů a právnických osob',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4153',
        name: 'Neinvestiční transfery přijaté od Evropské unie',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4159',
        name: 'Ostatní neinvestiční přijaté transfery ze zahraničí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4160',
        name: 'Neinvestiční přijaté transfery ze státních finančních aktiv',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4211',
        name:
          'Investiční přijaté transfery z všeobecné pokladní správy státního rozpočtu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4212',
        name:
          'Investiční přijaté transfery ze státního rozpočtu v rámci souhrnného dotačního vztahu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4213',
        name: 'Investiční přijaté transfery ze státních fondů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4214',
        name:
          'Investiční přijaté transfery ze zvláštních fondů ústřední úrovně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4216',
        name: 'Ostatní investiční přijaté transfery ze státního rozpočtu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4218',
        name: 'Investiční převody z Národního fondu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4219',
        name:
          'Ostatní investiční přijaté transfery od veřejných rozpočtů ústřední úrovně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4221',
        name: 'Investiční přijaté transfery od obcí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4222',
        name: 'Investiční přijaté transfery od krajů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4223',
        name: 'Investiční přijaté transfery od regionálních rad',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4229',
        name: 'Ostatní investiční přijaté transfery od rozpočtů územní úrovně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4231',
        name: 'Investiční přijaté transfery od cizích států',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4232',
        name: 'Investiční přijaté transfery od mezinárodních institucí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4233',
        name: 'Investiční transfery přijaté od Evropské unie',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '4240',
        name: 'Investiční přijaté transfery ze státních finančních aktiv',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5011',
        name:
          'Platy zaměstnanců v pracovním poměru vyjma zaměstnanců na služebních místech',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5012',
        name:
          'Platy zaměstnanců bezpečnostních sborů a ozbrojených sil ve služebním poměru',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5013',
        name:
          'Platy zaměstnanců na služebních místech podle zákona o státní službě',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5014',
        name:
          'Platy zaměstnanců v pracovním poměru odvozované od platů ústavních činitelů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5019',
        name: 'Ostatní platy',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5021',
        name: 'Ostatní osobní výdaje',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5022',
        name: 'Platy představitelů státní moci a některých orgánů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5023',
        name: 'Odměny členů zastupitelstev obcí a krajů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {id: '5024', name: 'Odstupné', validFrom: '1900-01-01T00:00:00.000Z'},
      {id: '5025', name: 'Odbytné', validFrom: '1900-01-01T00:00:00.000Z'},
      {id: '5026', name: 'Odchodné', validFrom: '1900-01-01T00:00:00.000Z'},
      {
        id: '5027',
        name: 'Peněžní náležitosti vojáků v záloze ve službě',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5029',
        name: 'Ostatní platby za provedenou práci jinde nezařazené',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5031',
        name:
          'Povinné pojistné na sociální zabezpečení a příspěvek na státní politiku zaměstnanosti',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5032',
        name: 'Povinné pojistné na veřejné zdravotní pojištění',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5038',
        name: 'Povinné pojistné na úrazové pojištění',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5039',
        name: 'Ostatní povinné pojistné placené zaměstnavatelem',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5041',
        name: 'Odměny za užití duševního vlastnictví',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5051',
        name: 'Mzdové náhrady',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {id: '5131', name: 'Potraviny', validFrom: '1900-01-01T00:00:00.000Z'},
      {
        id: '5132',
        name: 'Ochranné pomůcky',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5133',
        name: 'Léky a zdravotnický materiál',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5134',
        name: 'Prádlo, oděv a obuv',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5135',
        name: 'Učebnice a bezplatně poskytované školní potřeby',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5136',
        name: 'Knihy, učební pomůcky a tisk',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5137',
        name: 'Drobný hmotný dlouhodobý majetek',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5138',
        name: 'Nákup zboží (za účelem dalšího prodeje)',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5139',
        name: 'Nákup materiálu jinde nezařazený',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5141',
        name: 'Úroky vlastní',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5142',
        name: 'Kursové rozdíly ve výdajích',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5143',
        name: 'Úroky vzniklé převzetím cizích závazků',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5144',
        name: 'Poplatky dluhové služby',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5145',
        name: 'Neúrokové výdaje na finanční deriváty k vlastním dluhopisům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5149',
        name: 'Ostatní úroky a ostatní finanční výdaje',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {id: '5151', name: 'Studená voda', validFrom: '1900-01-01T00:00:00.000Z'},
      {id: '5152', name: 'Teplo', validFrom: '1900-01-01T00:00:00.000Z'},
      {id: '5153', name: 'Plyn', validFrom: '1900-01-01T00:00:00.000Z'},
      {
        id: '5154',
        name: 'Elektrická energie',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {id: '5155', name: 'Pevná paliva', validFrom: '1900-01-01T00:00:00.000Z'},
      {
        id: '5156',
        name: 'Pohonné hmoty a maziva',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {id: '5157', name: 'Teplá voda', validFrom: '1900-01-01T00:00:00.000Z'},
      {
        id: '5159',
        name: 'Nákup ostatních paliv a energie',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5161',
        name: 'Poštovní služby',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5162',
        name: 'Služby elektronických komunikací',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5163',
        name: 'Služby peněžních ústavů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {id: '5164', name: 'Nájemné', validFrom: '1900-01-01T00:00:00.000Z'},
      {
        id: '5165',
        name: 'Nájemné za půdu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5166',
        name: 'Konzultační, poradenské a právní služby',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5167',
        name: 'Služby školení a vzdělávání',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5168',
        name:
          'Zpracování dat a služby související s informačními a komunikačními technologiemi',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5169',
        name: 'Nákup ostatních služeb',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5171',
        name: 'Opravy a udržování',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5172',
        name: 'Programové vybavení',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5173',
        name: 'Cestovné (tuzemské i zahraniční)',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {id: '5175', name: 'Pohoštění', validFrom: '1900-01-01T00:00:00.000Z'},
      {
        id: '5176',
        name: 'Účastnické poplatky na konference',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5178',
        name: 'Nájemné za nájem s právem koupě',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5179',
        name: 'Ostatní nákupy jinde nezařazené',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5181',
        name: 'Poskytnuté zálohy vnitřním organizačním jednotkám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5182',
        name: 'Poskytované zálohy vlastní pokladně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5183',
        name: 'Výdaje na realizaci záruk',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5184',
        name: 'Výdaje na vládní úvěry',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5189',
        name: 'Ostatní poskytované zálohy a jistiny',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5191',
        name: 'Zaplacené sankce',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5192',
        name: 'Poskytnuté náhrady',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5193',
        name: 'Výdaje na dopravní územní obslužnost',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {id: '5194', name: 'Věcné dary', validFrom: '1900-01-01T00:00:00.000Z'},
      {
        id: '5195',
        name: 'Odvody za neplnění povinnosti zaměstnávat zdravotně postižené',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5196',
        name:
          'Náhrady a příspěvky související s výkonem ústavní funkce a funkce soudce',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5197',
        name:
          'Náhrady zvýšených nákladů spojených s výkonem funkce v zahraničí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5199',
        name: 'Ostatní výdaje související s neinvestičními nákupy',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5211',
        name: 'Neinvestiční transfery finančním institucím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5212',
        name:
          'Neinvestiční transfery nefinančním podnikatelskýmsubjektům-fyzickým osobám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5213',
        name:
          'Neinvestiční transfery nefinančním podnikatelským subjektům-právnickým osobám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5214',
        name:
          'Neinvestiční transfery finančním a podobným institucím ve vlastnictví státu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5215',
        name:
          'Neinvestiční transfery vybraným podnikatelským subjektům ve vlastnictví státu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5219',
        name: 'Ostatní neinvestiční transfery podnikatelským subjektům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5221',
        name: 'Neinvestiční transfery obecně prospěšným společnostem',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5222',
        name: 'Neinvestiční transfery spolkům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5223',
        name: 'Neinvestiční transfery církvím a náboženským společnostem',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5224',
        name: 'Neinvestiční transfery politickým stranám a hnutím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5225',
        name: 'Neinvestiční transfery společenstvím vlastníků jednotek',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5229',
        name:
          'Ostatní neinvestiční transfery neziskovým a podobným organizacím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5250',
        name:
          'Refundace poloviny náhrady mzdy za dočasnou pracovní neschopnost',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5311',
        name: 'Neinvestiční transfery státnímu rozpočtu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5312',
        name: 'Neinvestiční transfery státním fondům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5313',
        name: 'Neinvestiční transfery zvláštním fondům ústřední úrovně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5314',
        name:
          'Neinvestiční transfery fondům sociálního a veřejného zdravotního pojištění',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5315',
        name: 'Odvod daně za zaměstnance',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5316',
        name:
          'Odvod pojistného na sociální zabezpečení a  příspěvku na státní politiku zaměstnanosti za zaměstnance',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5317',
        name: 'Odvod pojistného na veřejné zdravotní pojištění za zaměstnance',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5318',
        name: 'Neinvestiční transfery prostředků do státních finančních aktiv',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5319',
        name: 'Ostatní neinvestiční transfery jiným veřejným rozpočtům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5321',
        name: 'Neinvestiční transfery obcím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5322',
        name:
          'Neinvestiční transfery obcím v rámci souhrnného dotačního vztahu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5323',
        name: 'Neinvestiční transfery krajům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5324',
        name:
          'Neinvestiční transfery krajům v rámci souhrnného dotačního vztahu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5325',
        name: 'Neinvestiční transfery regionálním radám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5329',
        name: 'Ostatní neinvestiční transfery veřejným rozpočtům územní úrovně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5331',
        name: 'Neinvestiční příspěvky zřízeným příspěvkovým organizacím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5332',
        name: 'Neinvestiční transfery vysokým školám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5333',
        name:
          'Neinvestiční transfery školským právnickým osobámzřízeným státem, kraji a obcemi',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5334',
        name: 'Neinvestiční transfery veřejným výzkumným institucím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5336',
        name: 'Neinvestiční transfery zřízeným příspěvkovým organizacím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5339',
        name: 'Neinvestiční  transfery cizím příspěvkovým organizacím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5341',
        name: 'Převody vlastním fondům hospodářské (podnikatelské) činnosti',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5342',
        name:
          'Převody fondu kulturních a sociálních potřeb a sociálnímu fondu obcí a krajů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5343',
        name: 'Převody na účty nemající povahu veřejných rozpočtů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5344',
        name: 'Převody vlastním rezervním fondům územních rozpočtů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5345',
        name: 'Převody vlastním rozpočtovým účtům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5346',
        name: 'Převody do fondů organizačních složek státu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5349',
        name: 'Ostatní převody vlastním fondům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {id: '5361', name: 'Nákup kolků', validFrom: '1900-01-01T00:00:00.000Z'},
      {
        id: '5362',
        name: 'Platby daní a poplatků státnímu rozpočtu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5363',
        name: 'Úhrady sankcí jiným rozpočtům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5364',
        name:
          'Vratky transferů poskytnutých z veřejných rozpočtů ústřední úrovně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5365',
        name: 'Platby daní a poplatků krajům, obcím a státním fondům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5366',
        name:
          'Výdaje z finančního vypořádání minulých let mezi krajem a obcemi',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5367',
        name: 'Výdaje z finančního vypořádání minulých let mezi obcemi',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5368',
        name:
          'Výdaje z finančního vypořádání minulých let mezi regionální radou a kraji, obcemi a dobrovolnými svazky obcí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5369',
        name: 'Ostatní neinvestiční transfery jiným veřejným rozpočtům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5410',
        name: 'Sociální dávky',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5421',
        name: 'Náhrady z úrazového pojištění',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5422',
        name: 'Náhrady povahy rehabilitací',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5423',
        name: 'Náhrady mezd podle zákona č. 118/2000 Sb.',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5424',
        name: 'Náhrady mezd v době nemoci',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5429',
        name: 'Ostatní náhrady placené obyvatelstvu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5491',
        name: 'Stipendia žákům, studentům a doktorandům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5492',
        name: 'Dary obyvatelstvu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5493',
        name: 'Účelové neinvestiční transfery fyzickým osobám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5494',
        name: 'Neinvestiční transfery obyvatelstvu nemající charakter daru',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5499',
        name: 'Ostatní neinvestiční transfery obyvatelstvu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5511',
        name: 'Neinvestiční transfery mezinárodním vládním organizacím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5512',
        name: 'Neinvestiční transfery nadnárodním orgánům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5513',
        name:
          'Vratky neoprávněně použitých nebo zadržených prostředků Evropské unii',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5514',
        name:
          'Odvody vlastních zdrojů Evropské unie do rozpočtu Evropské unie podle daně z přidané hodnoty',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5515',
        name:
          'Odvody vlastních zdrojů Evropské unie do rozpočtu Evropské unie podle hrubého národního důchodu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5520',
        name: 'Neinvestiční transfery cizím státům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5531',
        name: 'Peněžní dary do zahraničí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5532',
        name: 'Ostatní neinvestiční transfery do zahraničí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5611',
        name: 'Neinvestiční půjčené prostředky finančním institucím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5612',
        name:
          'Neinvestiční půjčené prostředky nefinančním podnikatelským subjektům-fyzickým osobám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5613',
        name:
          'Neinvestiční půjčené prostředky nefinančním podnikatelským subjektům-právnickým osobám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5614',
        name:
          'Neinvestiční půjčené prostředky finančním a podobným institucím ve vlastnictví státu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5615',
        name:
          'Neinvestiční půjčené prostředky vybraným podnikatelským subjektům ve vlastnictví státu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5619',
        name:
          'Ostatní neinvestiční půjčené prostředky podnikatelským subjektům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5621',
        name: 'Neinvestiční půjčené prostředky obecně prospěšným společnostem',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5622',
        name: 'Neinvestiční půjčené prostředky spolkům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5623',
        name:
          'Neinvestiční půjčené prostředky církvím a náboženským společnostem',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5624',
        name:
          'Neinvestiční půjčené prostředky společenstvím vlastníků jednotek',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5629',
        name:
          'Ostatní neinvestiční půjčené prostředky neziskovým a podobným organizacím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5631',
        name: 'Neinvestiční půjčené prostředky státnímu rozpočtu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5632',
        name: 'Neinvestiční půjčené prostředky státním fondům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5633',
        name:
          'Neinvestiční půjčené prostředky zvláštním fondům ústřední úrovně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5634',
        name:
          'Neinvestiční půjčené prostředky fondům sociálního a zdravotního pojištění',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5639',
        name:
          'Ostatní neinvestiční půjčené prostředky jiným veřejným rozpočtům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5641',
        name: 'Neinvestiční půjčené prostředky obcím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5642',
        name: 'Neinvestiční půjčené prostředky krajům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5643',
        name: 'Neinvestiční půjčené prostředky regionálním radám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5649',
        name:
          'Ostatní neinvestiční půjčené prostředky veřejným rozpočtům územní úrovně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5651',
        name:
          'Neinvestiční půjčené prostředky zřízeným příspěvkovým organizacím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5652',
        name: 'Neinvestiční půjčené prostředky vysokým školám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5659',
        name:
          'Neinvestiční půjčené prostředky ostatním příspěvkovým organizacím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5660',
        name: 'Neinvestiční půjčené prostředky obyvatelstvu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5670',
        name: 'Neinvestiční půjčené prostředky do zahraničí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5710',
        name: 'Převody Národnímu fondu na spolufinancování programu Phare',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5720',
        name: 'Převody Národnímu fondu na spolufinancování programu Ispa',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5730',
        name: 'Převody Národnímu fondu na spolufinancování programu Sapard',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5740',
        name:
          'Převody Národnímu fondu na spolufinancování komunitárních programů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5750',
        name:
          'Převody Národnímu fondu na spolufinancování ostatních programů Evropské unie a ČR',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5760',
        name:
          'Převody Národnímu fondu na spolufinancování související s poskytnutím pomoci ČR ze zahraničí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5770',
        name:
          'Převody ze státního rozpočtu do Národního fondu na vyrovnání kursových rozdílů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5790',
        name: 'Ostatní převody do Národního fondu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5901',
        name: 'Nespecifikované rezervy',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5902',
        name: 'Ostatní výdaje z finančního vypořádání minulých let',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '5909',
        name: 'Ostatní neinvestiční výdaje jinde nezařazené',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6111',
        name: 'Programové vybavení',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6112',
        name: 'Ocenitelná práva',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6113',
        name: 'Nehmotné výsledky výzkumné a obdobné činnosti',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6119',
        name: 'Ostatní nákup dlouhodobého nehmotného majetku',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6121',
        name: 'Budovy, haly a stavby',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6122',
        name: 'Stroje, přístroje a zařízení',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6123',
        name: 'Dopravní prostředky',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6124',
        name: 'Pěstitelské celky trvalých porostů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6125',
        name: 'Výpočetní technika',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6127',
        name: 'Kuturní předměty',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6129',
        name: 'Nákup dlouhodobého hmotného majetku jinde nezařazený',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {id: '6130', name: 'Pozemky', validFrom: '1900-01-01T00:00:00.000Z'},
      {id: '6201', name: 'Nákup akcií', validFrom: '1900-01-01T00:00:00.000Z'},
      {
        id: '6202',
        name: 'Nákup majetkových podílů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6209',
        name: 'Nákup ostatních majetkových nároků',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6311',
        name: 'Investiční transfery finančním institucím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6312',
        name:
          'Investiční transfery nefinančním podnikatelským subjektům-fyzickým osobám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6313',
        name:
          'Investiční transfery nefinančním podnikatelským subjektům-právnickým osobám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6314',
        name:
          'Investiční transfery finančním a podobným institucím ve vlastnictví státu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6315',
        name:
          'Investiční transfery vybraným podnikatelským subjektům ve vlastnictví státu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6319',
        name: 'Ostatní investiční transfery podnikatelským subjektům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6321',
        name: 'Investiční transfery obecně prospěšným společnostem',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6322',
        name: 'Investiční transfery spolkům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6323',
        name: 'Investiční transfery církvím a náboženským společnostem',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6324',
        name: 'Investiční transfery společenstvím vlastníků jednotek',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6329',
        name: 'Ostatní investiční transfery neziskovým a podobným organizacím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6331',
        name: 'Investiční transfery státnímu rozpočtu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6332',
        name: 'Investiční transfery státním fondům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6333',
        name: 'Investiční transfery zvláštním fondům ústřední úrovně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6334',
        name: 'Investiční transfery fondům sociálního a zdravotního pojištění',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6335',
        name: 'Investiční transfery státním finančním aktivům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6339',
        name: 'Ostatní investiční transfery jiným veřejným rozpočtům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6341',
        name: 'Investiční transfery obcím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6342',
        name: 'Investiční transfery krajům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6343',
        name: 'Investiční transfery obcím v rámci souhrnného dotačního vztahu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6344',
        name: 'Investiční transfery krajům v rámci souhrnného dotačního vztahu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6345',
        name: 'Investiční transfery regionálním radám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6349',
        name: 'Ostatní investiční transfery veřejným rozpočtům územní úrovně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6351',
        name: 'Investiční transfery zřízeným příspěvkovým organizacím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6352',
        name: 'Investiční transfery vysokým školám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6353',
        name:
          'Investiční transfery školským právnickým osobám zřízeným státem, kraji a obcemi',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6354',
        name: 'Investiční transfery veřejným výzkumným institucím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6359',
        name: 'Investiční transfery ostatním příspěvkovým organizacím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6361',
        name:
          'Investiční převody do rezervního fondu organizačních složek státu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6371',
        name: 'Účelové investiční transfery nepodnikajícím fyzickým osobám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6379',
        name: 'Ostatní investiční transfery obyvatelstvu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6380',
        name: 'Investiční transfery do zahraničí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6411',
        name: 'Investiční půjčené prostředky finančním institucím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6412',
        name:
          'Investiční půjčené prostředky nefinančním podnikatelským subjektům-fyzickým osobám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6413',
        name:
          'Investiční půjčené prostředky nefinančním podnikatelským subjektům-právnickým osobám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6414',
        name:
          'Investiční půjčené prostředky finančním a podobným institucím ve vlastnictví státu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6415',
        name:
          'Investiční půjčené prostředky vybraným podnikatelským subjektům ve vlastnictví státu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6419',
        name: 'Ostatní investiční půjčené prostředky podnikatelským subjektům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6421',
        name: 'Investiční půjčené prostředky obecně prospěšným společnostem',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6422',
        name: 'Investiční půjčené prostředky spolkům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6423',
        name:
          'Investiční půjčené prostředky církvím a náboženským společnostem',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6424',
        name: 'Investiční půjčené prostředky společenstvím vlastníků jednotek',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6429',
        name:
          'Ostatní investiční půjčené prostředky neziskovým a podobným organizacím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6431',
        name: 'Investiční půjčené prostředky státnímu rozpočtu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6432',
        name: 'Investiční půjčené prostředky státním fondům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6433',
        name: 'Investiční půjčené prostředky zvláštním fondům ústřední úrovně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6434',
        name:
          'Investiční půjčené prostředky fondům sociálního a zdravotního pojištění',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6439',
        name: 'Ostatní investiční půjčené prostředky jiným veřejným rozpočtům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6441',
        name: 'Investiční půjčené prostředky obcím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6442',
        name: 'Investiční půjčené prostředky krajům',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6443',
        name: 'Investiční půjčené prostředky regionálním radám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6449',
        name:
          'Ostatní investiční půjčené prostředky veřejným rozpočtům místní úrovně',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6451',
        name: 'Investiční půjčené prostředky zřízeným příspěvkovým organizacím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6452',
        name: 'Investiční půjčené prostředky vysokým školám',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6459',
        name: 'Investiční půjčené prostředky ostatním příspěvkovým organizacím',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6460',
        name: 'Investiční půjčené prostředky obyvatelstvu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6470',
        name: 'Investiční půjčené prostředky do zahraničí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6710',
        name:
          'Investiční převody Národnímu fondu na spolufinancování programu Phare',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6720',
        name:
          'Investiční převody Národnímu fondu na spolufinancování programu Ispa',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6730',
        name:
          'Investiční převody Národnímu fondu na spolufinancování programu Sapard',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6740',
        name:
          'Investiční převody Národnímu fondu na spolufinancování komunitárních programů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6750',
        name:
          'Investiční převody Národnímu fondu na spolufinancování ostatních programů Evropské unie a ČR',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6760',
        name:
          'Investiční převody Národnímu fondu na spolufinancování související s poskytnutím pomoci ČR ze zahraničí',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6790',
        name: 'Ostatní investiční převody do Národního fondu',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6901',
        name: 'Rezervy kapitálových výdajů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '6909',
        name: 'Ostatní kapitálové výdaje jinde nezařazené',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8111',
        name: 'Krátkodobé vydané dluhopisy',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8112',
        name: 'Uhrazené splátky krátkodobých vydaných dluhopisů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8113',
        name: 'Krátkodobé přijaté půjčené prostředky',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8114',
        name: 'Uhrazené splátky krátkodobých přijatých půjčených prostředků',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8115',
        name:
          'Změny stavu krátkodobých prostředků na bankovních účtech kromě změn stavů účtů státních finančních aktiv, které tvoří kapitolu OSFA',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8117',
        name: 'Aktivní krátkodobé operace řízení likvidity - příjmy',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8118',
        name: 'Aktivní krátkodobé operace řízení likvidity - výdaje',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8121',
        name: 'Dlouhodobé vydané dluhopisy',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8122',
        name: 'Uhrazené splátky dlouhodobých vydaných dluhopisů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8123',
        name: 'Dlouhodobé přijaté půjčené prostředky',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8124',
        name: 'Uhrazené splátky dlouhodobých přijatých půjčenýchprostředků',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8125',
        name: 'Změna stavu dlouhodobých prostředků na bankovních účtech',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8127',
        name: 'Aktivní dlouhodobé operace řízení likvidity - příjmy',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8128',
        name: 'Aktivní dlouhodobé operace řízení likvidity - výdaje',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8211',
        name: 'Krátkodobé vydané dluhopisy',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8212',
        name: 'Uhrazené splátky krátkodobých vydaných dluhopisů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8213',
        name: 'Krátkodobé přijaté půjčené prostředky',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8214',
        name: 'Uhrazené splátky krátkodobých přijatých půjčenýchprostředků',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8215',
        name:
          'Změna stavu bankovních účtů krátkodobých prostředků ze zahraničí jiných než ze zahraničních dlouhodobých úvěrů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8217',
        name: 'Aktivní krátkodobé operace řízení likvidity - příjmy',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8218',
        name: 'Aktivní krátkodobé operace řízení likvidity - výdaje',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8221',
        name: 'Dlouhodobé vydané dluhopisy',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8222',
        name: 'Uhrazené splátky dlouhodobých vydaných dluhopisů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8223',
        name: 'Dlouhodobé přijaté půjčené prostředky',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8224',
        name: 'Uhrazené splátky dlouhodobých přijatých půjčených prostředků',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8225',
        name: 'Změna stavu dlouhodobých prostředků na bankovních účtech',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8227',
        name: 'Aktivní dlouhodobé operace řízení likvidity - příjmy',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8228',
        name: 'Aktivní dlouhodobé operace řízení likvidity - výdaje',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8901',
        name:
          'Operace z peněžních účtů organizace nemající charakter příjmů a výdajů vládního sektoru',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '8902',
        name: 'Nerealizované kursové rozdíly pohybů na devizových účtech',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
    ],
  },
  {
    name: 'paragraph-groups',
    data: [
      {
        id: '10',
        name: 'Zemědělství, lesní hospodářství a rybářství',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {
        id: '21',
        name: 'Průmysl, stavebnictví, obchod a služby',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {id: '22', name: 'Doprava', validFrom: '1990-01-01T00:00:00.000Z'},
      {
        id: '23',
        name: 'Vodní hospodářství',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {id: '24', name: 'Spoje', validFrom: '1990-01-01T00:00:00.000Z'},
      {
        id: '25',
        name: 'Všeobecné hospodářské záležitosti a ostatní ekonomické funkce',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {
        id: '31',
        name: 'Vzdělávání a školské služby',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {
        id: '32',
        name: 'Vzdělávání a školské služby',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {
        id: '33',
        name: 'Kultura, církve a sdělovací prostředky',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {
        id: '34',
        name: 'Tělovýchova a zájmová činnost',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {id: '35', name: 'Zdravotnictví', validFrom: '1990-01-01T00:00:00.000Z'},
      {
        id: '36',
        name: 'Bydlení, komunální služby a územní rozvoj',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {
        id: '37',
        name: 'Ochrana životního prostředí',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {
        id: '38',
        name: 'Ostatní výzkum a vývoj',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {
        id: '39',
        name: 'Ostatní činnosti související se službami pro obyvatelstvo',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {
        id: '41',
        name: 'Dávky a podpory v sociálním zabezpečení',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {
        id: '42',
        name: 'Politika zaměstnanosti',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {
        id: '43',
        name:
          'Sociální služby a společné činnosti v sociálním zabezpečení a politice zaměstnanosti',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {id: '51', name: 'Obrana', validFrom: '1990-01-01T00:00:00.000Z'},
      {
        id: '52',
        name: 'Civilní připravenost na krizové stavy',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {
        id: '53',
        name: 'Bezpečnost a veřejný pořádek',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {id: '54', name: 'Právní ochrana', validFrom: '1990-01-01T00:00:00.000Z'},
      {
        id: '55',
        name: 'Požární ochrana a integrovaný záchranný systém',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {
        id: '61',
        name: 'Státní moc, státní správa, územní samospráva a politické strany',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {
        id: '62',
        name: 'Jiné veřejné služby a činnosti',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {
        id: '63',
        name: 'Finanční operace',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
      {
        id: '64',
        name: 'Ostatní činnosti',
        validFrom: '1990-01-01T00:00:00.000Z',
      },
    ],
  },
  {
    name: 'item-groups',
    data: [
      {
        id: '11',
        name: 'Daně z příjmů, zisku a kapitálových výnosů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '12',
        name: 'Daně ze zboží a služeb v tuzemsku',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '13',
        name: 'Daně a poplatky z vybraných činností a služeb',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '14',
        name: 'Daně a cla za zboží a služby ze zahraničí ',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {id: '15', name: 'Majetkové daně', validFrom: '1900-01-01T00:00:00.000Z'},
      {
        id: '16',
        name:
          'Povinné pojistné na sociální zabezpečení, příspěvek na státní politiku zaměstnanosti a veřejné zdravotní pojištění',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '17',
        name: 'Ostatní daňové příjmy',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '21',
        name:
          'Příjmy z vlastní činnosti a odvody přebytků organizací s přímým vztahem',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '22',
        name: 'Přijaté sankční platby a vratky transferů',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '23',
        name:
          'Příjmy z prodeje nekapitálového majetku a ostatní nedaňové příjmy',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '24',
        name: 'Přijaté splátky půjčených prostředků ',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '25',
        name: 'Příjmy sdílené s nadnárodním orgánem',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '31',
        name:
          'Příjmy z prodeje dlouhodobého majetku a ostatní kapitálové příjmy',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '32',
        name: 'Příjmy z prodeje akcií a majetkových podílů ',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '41',
        name: 'Neinvestiční přijaté transfery',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
      {
        id: '42',
        name: 'Investiční přijaté transfery',
        validFrom: '1900-01-01T00:00:00.000Z',
      },
    ],
  },
];

exports.up = async function (knex) {
  for (const codelist of data) {
    await knex('data.codelists').where({codelist: codelist.name}).delete();
    await knex('data.codelists').insert(
      codelist.data.map(item => ({codelist: codelist.name, ...item}))
    );
  }
};

exports.down = async function (knex) {
  return knex('data.codelists').delete();
};
