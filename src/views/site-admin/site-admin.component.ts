import { Component, trigger, state, style, transition, animate } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { UserService } 		from '../../services/user.service';

import { Module, MODULES } from "../../shared/data/modules";

//00006947
@Component({
	moduleId: module.id,
	selector: 'site-admin',
	templateUrl: 'site-admin.template.html',
	styleUrls: ['site-admin.style.css']
})
export class SiteAdminComponent {
  
  modules = MODULES;

  cat:string;

	public isMenuCollapsed: boolean = true;

	constructor(private route: ActivatedRoute, public userService:UserService) {
		
	}

	ngOnInit(){
		this.route.params.forEach((params: Params) => {			
			this.cat = params["cat"];
		});
	}

}