var fs = require("fs");

module.exports = {
  
  database: {
    db: "cityvizor",    
    username: "",
    password: ""
  },
  
  cron: {
    enable: true,
    time: "00 00 01 * * *"
  },
  
  server: {
    port: 80, // redirect to ssl
    compression: true
  },
  
  ssl: {
    enable: true,
    cert: fs.readFileSync('../cert/fullchain.pem'),
    key: fs.readFileSync('../cert/privkey.pem')
  },
  
  jwt: {
    secret: "top.secret",
    credentialsRequired: false
  },
  
  uploads: {
    saveDir: "uploads"
  },
  
  mongoExpress: {
    enable: false,
    secret: "top.secret",
    username: "username",
    password: "password"
  },

  import: {
    saveDir: "imports"
  },
  
  export: {
    saveDir: "exports"
  }
  
}