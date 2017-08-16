import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DataService } 		from '../../../services/data.service';
import { ToastService } 		from '../../../services/toast.service';

import { Profile } from "../../../shared/schema/profile";

//00006947
@Component({
	moduleId: module.id,
	selector: 'site-admin-profiles',
	templateUrl: 'site-admin-profiles.template.html',
	styleUrls: ['site-admin-profiles.style.css']
})
export class SiteAdminProfilesComponent {

	profiles:Profile[] = [];

	currentProfile:Profile;

	profileLoading:boolean = false;

	constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private toastService: ToastService) {
		
	}
	
	ngOnInit(){
    this.loadProfiles();
		
		this.route.params.forEach((params: Params) => {		
			
			if(params["profile"]) this.loadProfile(params["profile"]);
			else this.currentProfile = null;
			
		});
		
  }

	loadProfiles(){
	// load profiles and save to local variable
			this.dataService.getProfiles({hidden:1})
				.then(profiles => {
					this.profiles = profiles;
					this.profiles.sort((a,b) => a.name > b.name ? 1 : (a.name < b.name ? -1 : 0));
				})
				.catch(err => {
					this.toastService.toast("Nastala neznámá chyba při načítání profilů.","error");
				});
	}

	loadProfile(profileId){
		
		
		
		if(!profileId) return;
		
		this.profileLoading = true;
		this.currentProfile = null;
		
		this.dataService.getProfile(profileId)
      .then(profile => {
        this.currentProfile = profile;
				this.profileLoading = false;
      })
			.catch(err => {
				this.profileLoading = false;
				this.toastService.toast("Nastala neznámá chyba při načítání profilu.","error");
			});
	}

	saveProfile(profile){
		this.dataService.saveProfile(profile)
			.then(profile => {
				this.toastService.toast("Uloženo.","notice");
				this.loadProfiles();
			})
			.catch(err => this.toastService.toast("Nastala neznámá chyba při ukládání profilu.","error"));
	}

	createProfile(){

		this.dataService.createProfile({})
			.then(profile => {
				this.toastService.toast("Profil vytvořen.","notice");
				this.loadProfiles();
				this.selectProfile(profile._id);
			})
			.catch(err => this.toastService.toast("Nastala chyba při vytváření profilu.","notice"));
	}

	deleteProfile(profileId){
	}

	getDetailLink(profileId){
		return profileId ? ["./",{profile:profileId}] : ["./",{}];
	}

	selectProfile(profileId){
		this.router.navigate(this.getDetailLink(profileId),{relativeTo:this.route});
	}

	getProfileLink(profile){
		return "/" + (profile.url || profile._id);
	}

}