import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ToastService } 		from '../../services/toast.service';
import { DataService } 		from '../../services/data.service';

import { Module, MODULES } from "../../shared/data/modules";


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

	modules: Array<Module>;
	
	activeModule: Module;

	constructor( private dataService: DataService, private toastService: ToastService, private route: ActivatedRoute, private router:Router) {

		this.modules = MODULES;
		
	}
	 
	ngOnInit(){
		this.route.queryParams.forEach((params: Params) => this.view = params['view']);
	}
	 
	
	 
	openView(view){		 
    this.router.navigate(['/profil/' + this.profile.url + '/admin'], {queryParams:{view:view}});
	}
	 

}