var fs = require("fs");

module.exports = {
  
  database: {
    db: "cityvizor",    
    username: "",
    password: ""
  },
  
  cron: {
    time: "00 00 01 * * *",
    jobDelay: 5
  },
  
  server: {
    host: "0.0.0.0",
    port: 8000, // redirect to ssl
    compression: true
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
    enable: false,
    
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
    host: "edesky.cz",
    port: 443,
    path: "/api/v1/documents",
    api_key: "your api key"    
  }
  
}