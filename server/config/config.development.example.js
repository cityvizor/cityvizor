//var fs = require("fs");

module.exports = {
  
  database: {
    db: "cityvizor-test",
    username: "",
    password: "",
  },
  
  cron: {
    enable: false,
    time: "00 00 01 * * *",
    startDelay: 20,
    jobDelay: 5
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
    username: "user",
    password: "pass"
  }
  
}