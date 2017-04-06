import { Component } from '@angular/core';

import { DataService } 		from '../../../services/data.service';

import { Profile } from "../../../shared/schema/profile";
//00006947
@Component({
	moduleId: module.id,
	selector: 'site-admin-profiles',
	templateUrl: 'site-admin-profiles.template.html',
	styleUrls: []
})
export class SiteAdminProfilesComponent {

	profiles:Profile[] = [];

	constructor(private dataService: DataService) {
		
	}
	
	ngOnInit(){
    // load profiles and save to local variable
    this.dataService.getProfiles()
      .then(profiles => {
        this.profiles = profiles;
        this.profiles.sort((a,b) => a.name > b.name ? 1 : (a.name < b.name ? -1 : 0));
      });
  }

	getProfileLink(profile){
		return "/profil/" + (profile.url || profile._id);
	}

}