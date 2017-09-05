import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Title }     from '@angular/platform-browser';

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
	 
	config:any = AppConfig;

	constructor(private titleService: Title, private dataService: DataService, private toastService: ToastService, private route: ActivatedRoute, private router:Router) {
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
		
		// update url if neccessary
		if(oldUrl !== profile.url){
			this.router.navigate(this.getModuleLink(this.activeModule));
		}		
		
	}
	 
	getModuleLink(moduleId){
		return ['/profil/' + this.profile.url + '/admin/' + moduleId];
	}
	 

}