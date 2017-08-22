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
  
  ssl: {
    enable: false,
    cert: fs.readFileSync('../cert/fullchain.pem'),
    key: fs.readFileSync('../cert/privkey.pem'),
    redirect: true,
    redirectPort: 80
  },
  
  jwt: {
    secret: "secretphrase",
    credentialsRequired: false
  },
  
  uploads: {
    saveDir: "uploads"
  },
  
  mongoExpress: {
    enable: false,
    username: "user",
    password: "pass"
  },

  import: {
    saveDir: "imports"
  },
  
  export: {
    saveDir: "exports"
  }
  
}