import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';

import { ToastService } from "app/services/toast.service";
import { DataService } 		from 'app/services/data.service';

import { AppConfig, IAppConfig } from 'config/app-config';

//00006947
@Component({
	moduleId: module.id,
	selector: 'profile-admin-profile',
	templateUrl: 'profile-admin-profile.component.html',
	styleUrls: ['profile-admin-profile.component.scss']
})
export class ProfileAdminProfileComponent {

  @Input()
	profile: any;
	 
	@Output()
	saved:EventEmitter<any> = new EventEmitter();

	constructor(private toastService:ToastService, private dataService:DataService, @Inject(AppConfig) public config: IAppConfig) {
	}
	 
	save(form){
		
		if(form.valid){	
			
			var formData = form.value;
			var profileData = {
				_id: this.profile.id,
				name: formData.name,
				url: formData.url,
				ico: formData.ico,
				zuj: formData.zuj,
				edesky: formData.edesky,
				mapasamospravy: formData.mapasamospravy,
				gps: [Number(formData.gps0), Number(formData.gps1)],
				email: formData.email,
				status: formData.status,
			};

			this.dataService.saveProfile(profileData)
				.then(profile => {
					this.toastService.toast("uloženo", "check");
					this.saved.emit(profile);
				})
				.catch(err => this.toastService.toast("Nastala neznámá chyba při ukládání profilu.", "error"));
			
		}
		else{
			this.toastService.toast("Formulář není správně vyplněn.","error");
		}
	}

}