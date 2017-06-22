module.exports = {
  
  ssl:{
    cert: fs.readFileSync('./cert/fullchain.pem'),
    key: fs.readFileSync('./cert/privkey.pem')
  },

  import: {
    
    expenditureHeaderNames: {
    },

    eventHeaderNames: {
      "srcId": ["AKCE","ORG","ORJ"],
      "name": ["AKCE_NAZEV","ORG_NAZEV","ORJ_NAZEV"],
      "description": ["POPIS"],
      "gpsX": ["SOURADNICE_X"],
      "gpsY": ["SOURADNICE_y"]
    }
  }
}