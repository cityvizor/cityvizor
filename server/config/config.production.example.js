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
    secret: "lkadsj;2389fnawfdkj  \320  fjFQJLAKJWE.DC'CJ4A2590Q23",
    credentialsRequired: false
  },
  
  uploads: {
    saveDir: "uploads"
  },
  
  mongoExpress: {
    enable: false,
    username: "otevrenadata",
    password: "otevrenadata"
  },

  import: {
    saveDir: "imports"
  },
  
  export: {
    saveDir: "exports"
  }
  
}