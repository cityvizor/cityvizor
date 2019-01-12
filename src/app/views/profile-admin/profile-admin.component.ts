import { Component, Input, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Title }     from '@angular/platform-browser';

import { ToastService } 		from 'app/services/toast.service';
import { DataService } 		from 'app/services/data.service';

import { AppConfig, IAppConfig } from 'config/config';

@Component({
	moduleId: module.id,
	selector: 'profile-admin',
	templateUrl: 'profile-admin.component.html',
	styleUrls: ['profile-admin.component.scss'],
})
export class ProfileAdminComponent {

	@Input()
	profile: any;

	view: string; 
	
	activeModule: string;
	 
	constructor(private titleService: Title, private dataService: DataService, private toastService: ToastService, private route: ActivatedRoute, private router:Router, @Inject(AppConfig) private config:IAppConfig) {
	}
	 
	ngOnInit(){
		
		this.route.params.forEach((params: Params) => {

			if(!this.profile || this.profile.url !== params["profile"]) {
				
				this.dataService.getProfile(params["profile"])
					.then(profile => {
						this.profile = profile;
					
						this.titleService.setTitle(profile.name + " :: " + this.config.title);
					})
					.catch(err => {
						if(err.status === 404){
							this.toastService.toast("Obec nenalezena.","error");
						}
						else{
							this.toastService.toast("Nastala chyba při stahování dat obce.","error");
						}

						this.router.navigate(["/"]);

					});
			}
			
			this.activeModule = params["module"];
			
		});
	}
	 
	updateProfile(profile){
		
		let oldUrl = this.profile.url;
		
		this.profile = profile;
		
		this.titleService.setTitle(profile.name + " :: " + this.config.title);
		
		// update url if neccessary
		if(oldUrl !== profile.url){
			this.router.navigate(this.getModuleLink(this.activeModule));
		}		
		
	}
	 
	getModuleLink(moduleId){
		return ['/profil/' + this.profile.url + '/admin/' + moduleId];
	}
	 

}