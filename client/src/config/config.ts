 
// config injection token, i. e. the key in the injection storage map
import { InjectionToken } from '@angular/core';
export interface IAppConfig { [k:string]:any; }
export let AppConfig = new InjectionToken<IAppConfig>('app.config');

/* CONFIGURATION */

export interface Module {
	id: string;
	url: string;
	name: string;
	optional: boolean;
}

let modules:Module[] = [
  {"id": "expenditure-viz", "url": "vydaje", "name": "Výdaje", "optional": true},
  {"id": "income-viz", "url": "prijmy", "name": "Příjmy", "optional": true},	
  {"id": "invoice-list", "url": "faktury", "name": "Faktury", "optional": true},	
  {"id": "notice-board", "url": "uredni-deska", "name": "Úřední deska", "optional": true},
  {"id": "contract-list", "url": "registr-smluv", "name": "Registr smluv", "optional": true}
];

// configuration data
export const AppConfigData: IAppConfig = {

  title: "CityVizor.cz",
  // root directory for static documents referenced in various links throughout the site
  docsUrl: "https://cityvizor.github.io/cityvizor",

  avatarsUrl: "/data/uploads/avatars",
  
  GitHub: {url: "https://github.com/cityvizor/cityvizor"},

  // infomail used in texts
  mail: "cityvizor@otevrenamesta.cz",

  // modules and their names. this controls what shows in menus etc.
  modules: modules,

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