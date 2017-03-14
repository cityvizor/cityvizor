import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ToastService } 		from '../../services/toast.service';
import { DataService } 		from '../../services/data.service';

@Component({
	moduleId: module.id,
	selector: 'entity-admin',
	templateUrl: 'entity-admin.template.html',
	styleUrls: ['entity-admin.style.css'],
})
export class EntityAdminComponent {

	@Input()
	profile: any;	

	oldProfile: any;

	view: string; 
	
	activeModule: string;

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
	 
	getModuleLink(moduleId){
		return ['/profil/' + this.profile.url + '/admin/' + moduleId];
	}
	 

}