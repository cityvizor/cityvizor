
var AppConfig = {
  
  // root directory for static documents referenced in various links throughout the site
  docsUrl: "https://otevrena-data-mfcr.github.io/CityVizor",
  
  avatarsUrl: "/data/uploads/avatars",
  
  // infomail used in texts
  mail: "cityvizor@otevrenamesta.cz",
  
  // modules and their names. this controls what shows in menus etc.
  modules: [
    {"id": "dash-board", "url": "prehled", "name": "Aktuálně", "optional": false},
    {"id": "expenditure-viz", "url": "vydaje", "name": "Výdaje", "optional": true},
    {"id": "income-viz", "url": "prijmy", "name": "Příjmy", "optional": true},	
    {"id": "invoice-list", "url": "faktury", "name": "Faktury", "optional": true},	
    {"id": "notice-board", "url": "uredni-deska", "name": "Úřední deska", "optional": true},
    {"id": "contract-list", "url": "registr-smluv", "name": "Registr smluv", "optional": true},
  ]
  
}

export { AppConfig };