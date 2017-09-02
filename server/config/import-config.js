module.exports = {
  
  data: {
    headerNames: {
      amountType: ["amountType","PRIJEM_VYDAJ"],
      recordType: ["recordType","MODUL","DOKLAD_AGENDA"],
      paragraph: ["paragraph","PARAGRAF"],
      item: ["item","POLOZKA"],
      event: ["event","AKCE","ORG"],
      amount: ["amount","CASTKA"],
      date: ["date","DATUM","DOKLAD_DATUM"],
      counterpartyId: ["counterpartyId","SUBJEKT_IC"],
      counterpartyName: ["counterpartyName","SUBJEKT_NAZEV"],
      description: ["description","POZNAMKA"]
    },
    mandatoryFields: ["module","paragraph","item","amount"]
  },

  events: {
    headerNames: {
      "srcId": ["srcId","AKCE","ORG","ORJ"],
      "name": ["name","AKCE_NAZEV","ORG_NAZEV","ORJ_NAZEV"],
      "description": ["description","POPIS"],
      "gpsX": ["gpsX","SOURADNICE_X"],
      "gpsY": ["gpsY","SOURADNICE_Y"]
    },
    mandatoryFields: ["srcId","name"]
  }
  
};