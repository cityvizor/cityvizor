var fs = require("fs");

module.exports = {
  
  database: {
    db: "cityvizor",    
    username: "",
    password: ""
  },
  
  cron: {
    cronTime: "00 00 01 * * *",
    jobDelay: 5,
    start: false
  },
  
  server: {
    host: "0.0.0.0",
    port: 8000, // redirect to ssl
    compression: true
  },
  
  ssl: {
    enable: false,
    //cert: fs.readFileSync('../cert/fullchain.pem'),
    //key: fs.readFileSync('../cert/privkey.pem'),
    redirect: true,
    redirectPort: 80
  },
  
  jwt: {
    secret: "secretphrase",
    credentialsRequired: false
  },
  
  storage: {
    tmpDir: "/tmp",
    avatarsDir: "data/uploads/avatars",
    importsDir: "data/uploads/imports",
    exportsDir: "data/exports"
  },
  
  mongoExpress: {
    enable: false
  },
  
  eDesky: {
    url: "https://edesky.cz/api/v1/documents",
    api_key: "your api key"    
  }
  
}