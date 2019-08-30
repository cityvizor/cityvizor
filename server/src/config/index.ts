import path from "path";

const environment = require("../environment");

export default {

  apiRoot: environment.apiRoot,
  
  cors: {
    enabled: environment.cors,
    origin: environment.corsOrigin,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    exposedHeaders: ["Location"],
    allowedHeaders: ["Authorization", "Content-Type"]
  },

  cron: {
    cronTime: "00 00 07 * * *",
    runOnInit: false
  },

  database: environment.database,

  server: {
    host: environment.host,
    port: environment.port
  },

  static: {
    dir: environment.staticFiles,
    index: path.join(environment.staticFiles, "index.html")
  },

  storage: {
    tmp: path.resolve(environment.tmpDir),
    avatars: path.resolve(environment.storageDir,"avatars")
  },

  jwt: {
    secret: environment.keys.jwt.secret,
    expiration: "1d",
    credentialsRequired: false,
    getToken: (req) => {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      } else if (req.cookies && req.cookies["access_token"]) {
        return req.cookies.access_token;
      }
      return null;
    },
    cookieName: "access_token",
    cookieMaxAge: 1000 * 60 * 60 * 24
  },

  eDesky: {
    url: "https://edesky.cz/api/v1/documents",
    api_key: environment.keys.edesky.api_key
  },

  groups: {
    "paragraph": [{"id":"10","name":"Zemědělství, lesní hospodářství a rybářství"},{"id":"21","name":"Průmysl, stavebnictví, obchod a služby"},{"id":"22","name":"Doprava"},{"id":"23","name":"Vodní hospodářství"},{"id":"24","name":"Spoje"},{"id":"25","name":"Všeobecné hospodářské záležitosti a ostatní ekonomické funkce"},{"id":"31","name":"Vzdělávání a školské služby"},{"id":"32","name":"Vzdělávání a školské služby"},{"id":"33","name":"Kultura, církve a sdělovací prostředky"},{"id":"34","name":"Tělovýchova a zájmová činnost"},{"id":"35","name":"Zdravotnictví"},{"id":"36","name":"Bydlení, komunální služby a územní rozvoj"},{"id":"37","name":"Ochrana životního prostředí"},{"id":"38","name":"Ostatní výzkum a vývoj"},{"id":"39","name":"Ostatní činnosti související se službami pro obyvatelstvo"},{"id":"41","name":"Dávky a podpory v sociálním zabezpečení"},{"id":"42","name":"Politika zaměstnanosti"},{"id":"43","name":"Sociální služby a společné činnosti v sociálním zabezpečení a politice zaměstnanosti"},{"id":"51","name":"Obrana"},{"id":"52","name":"Civilní připravenost na krizové stavy"},{"id":"53","name":"Bezpečnost a veřejný pořádek"},{"id":"54","name":"Právní ochrana"},{"id":"55","name":"Požární ochrana a integrovaný záchranný systém"},{"id":"61","name":"Státní moc, státní správa, územní samospráva a politické strany"},{"id":"62","name":"Jiné veřejné služby a činnosti"},{"id":"63","name":"Finanční operace"},{"id":"64","name":"Ostatní činnosti"}],
    "item": [{"id":"11","name":"Daně z příjmů, zisku a kapitálových výnosů"},{"id":"12","name":"Daně ze zboží a služeb v tuzemsku"},{"id":"13","name":"Daně a poplatky z vybraných činností a služeb"},{"id":"14","name":"Daně a cla za zboží a služby ze zahraničí "},{"id":"15","name":"Majetkové daně"},{"id":"16","name":"Povinné pojistné na sociální zabezpečení, příspěvek na státní politiku zaměstnanosti a veřejné zdravotní pojištění"},{"id":"17","name":"Ostatní daňové příjmy"},{"id":"21","name":"Příjmy z vlastní činnosti a odvody přebytků organizací s přímým vztahem"},{"id":"22","name":"Přijaté sankční platby a vratky transferů"},{"id":"23","name":"Příjmy z prodeje nekapitálového majetku a ostatní nedaňové příjmy"},{"id":"24","name":"Přijaté splátky půjčených prostředků "},{"id":"25","name":"Příjmy sdílené s nadnárodním orgánem"},{"id":"31","name":"Příjmy z prodeje dlouhodobého majetku a ostatní kapitálové příjmy"},{"id":"32","name":"Příjmy z prodeje akcií a majetkových podílů "},{"id":"41","name":"Neinvestiční přijaté transfery"},{"id":"42","name":"Investiční přijaté transfery"}]
  }

}