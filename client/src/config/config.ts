 
// config injection token, i. e. the key in the injection storage map
import { InjectionToken } from '@angular/core';
export interface IAppConfig { [k:string]:any; }
export const AppConfig = new InjectionToken<IAppConfig>('app.config');

import { aclConfig } from "./acl";

/* CONFIGURATION */

export interface Module {
	id: string;
	url: string;
	name: string;
	optional: boolean;
}

// configuration data
export const AppConfigData: IAppConfig = {

  title: "CityVizor.cz",
  
  siteUrl: "https://cityvizor.prague.eu",
  docsUrl: "https://cityvizor.github.io/cityvizor",
  githubUrl: "https://github.com/cityvizor/cityvizor",

  avatarsUrl: "/data/uploads/avatars",
  
  // infomail used in texts
  mail: "cityvizor@otevrenamesta.cz",

  // modules and their names. this controls what shows in menus etc.
  acl: aclConfig

}