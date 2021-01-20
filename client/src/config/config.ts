// config injection token, i. e. the key in the injection storage map
import { InjectionToken, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { aclConfig } from "./acl";
/* CONFIGURATION */

export interface Module {
	id: string;
	url: string;
	name: string;
	optional: boolean;
}

// Load part of the config at runtime (for altenative content of some components)
// https://labs.thisdot.co/blog/runtime-environment-configuration-with-angular
@Injectable({
  providedIn: 'root'
})
export class ConfigService {

   config = {
    avatarsUrl: "/data/uploads/avatars",
    siteUrl: "https://cityvizor.cz",
    title: "Cityvizor",
    // modules and their names. this controls what shows in menus etc.
    acl: aclConfig,
    alternativePageContent: {} as any
  }

  constructor(private http: HttpClient) {}

  async loadConfig() {
    await this.http
      .get<any>('./assets/js/content.json')
      .toPromise()
      .then(content => {
        this.config.alternativePageContent = content
      });
  }

}
export const configFactory = (configService: ConfigService) => {
	return () => configService.loadConfig();
};