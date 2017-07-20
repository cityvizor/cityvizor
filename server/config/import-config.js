module.exports = {
  
  expenditures: {
    headerNames: {
      amountType: ["PRIJEM_VYDAJ"],
      recordType: ["MODUL","DOKLAD_AGENDA"],
      paragraph: ["PARAGRAF"],
      item: ["POLOZKA"],
      event: ["AKCE","ORJ"],
      amount: ["CASTKA"],
      date: ["DOKLAD_DATUM"],
      counterpartyId: ["SUBJEKT_IC"],
      counterpartyName: ["SUBJEKT_NAZEV"],
      description: ["POZNAMKA"]
    },
    mandatoryFields: ["module","paragraph","amount"]
  },

  events: {
    headerNames: {
      "srcId": ["AKCE","ORG","ORJ"],
      "name": ["AKCE_NAZEV","ORG_NAZEV","ORJ_NAZEV"],
      "description": ["POPIS"],
      "gpsX": ["SOURADNICE_X"],
      "gpsY": ["SOURADNICE_Y"]
    },
    mandatoryFields: ["srcId","name"]
  }
  
};