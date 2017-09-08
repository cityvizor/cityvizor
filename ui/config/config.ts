
var AppConfig = {

  title: "CityVizor.cz",
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
    {"id": "data-sources", "url": "data", "name": "Data", "optional": true},
  ],

  acl: {
    
    routes: [
      {
        route: "/admin/:cat",
        allowRoles: ["admin"]
      },
      {
        route: "/admin",
        allowRoles: ["admin"]
      },
      {
        route: "/ucet",
        allowRoles: ["admin","user"]
      },
      {
        route: "/:url/admin/:cat",
        allowRoles: ["admin"],
        //allowCheck: (user,params) => console.log(user,params)
        allowCheck: (user,params) => user.managedProfiles.indexOf(params.profile) !== -1
      },
      {
        route: "/:url/admin",
        allowRoles: ["admin"],
        //allowCheck: (user,params) => console.log(user,params)
        allowCheck: (user,params) => user.managedProfiles.indexOf(params.profile) !== -1
      }
    ],
    
    default: {
      allow: true
    }
    
  }

}

export { AppConfig };