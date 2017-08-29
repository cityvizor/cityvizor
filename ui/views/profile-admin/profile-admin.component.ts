import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ToastService } 		from '../../services/toast.service';
import { DataService } 		from '../../services/data.service';

import { AppConfig } from '../../config/app-config';

@Component({
	moduleId: module.id,
	selector: 'profile-admin',
	templateUrl: 'profile-admin.template.html',
	styleUrls: ['profile-admin.style.css'],
})
export class ProfileAdminComponent {

	@Input()
	profile: any;

	view: string; 
	
	activeModule: string;
	 
	appConfig:any = AppConfig;

	constructor( private dataService: DataService, private toastService: ToastService, private route: ActivatedRoute, private router:Router) {
	}
	 
	ngOnInit(){
		this.route.params.forEach((params: Params) => {
			if(!this.profile || this.profile.url !== params["profile"]) {
				this.dataService.getProfile(params["profile"]).then(profile => {
					this.profile = profile;
				});
			}
			
			this.activeModule = params["module"];
			
		});
	}
	 
	updateProfile(profile){
		
		// update url if neccessary
		if(this.profile.url !== profile.url){
			this.router.navigate(this.getModuleLink(this.activeModule));
		}
		
		this.profile = profile;
		
	}
	 
	getModuleLink(moduleId){
		return ['/profil/' + this.profile.url + '/admin/' + moduleId];
	}
	 

}