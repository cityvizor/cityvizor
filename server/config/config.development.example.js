//var fs = require("fs");

module.exports = {
  
  database: {
    db: "cityvizor-test",
    username: "",
    password: "",
  },
  
  cron: {
    cronTime: "00 00 01 * * *",
    jobDelay: 5,
    start: true
  },
  
  server: {
    host: "0.0.0.0",
    port: 8080,
    compression: true
  },
  
  ssl: {
    enable: false
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
    enable: true,
    
    secret: "dasddasds",
    username: "login",
    password: "password",
    
    host: "localhost",
    databases: [
      { database: "cityvizor", username: null, password: null },
      { database: "cityvizor-test", username: null, password: null }
    ]
  },
  
  eDesky: {
    url: "https://edesky.cz/api/v1/documents",
    api_key: "your api key"    
  }
  
}