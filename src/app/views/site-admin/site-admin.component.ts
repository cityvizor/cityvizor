import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title }     from '@angular/platform-browser';

import { AppConfig } from 'config/app-config';
import { ACLService } 		from 'app/services/acl.service';

@Component({
	moduleId: module.id,
	selector: 'site-admin',
	templateUrl: 'site-admin.component.html',
	styleUrls: ['site-admin.component.scss']
})
export class SiteAdminComponent {

	menuConfig = {
		title: {
			text: "Administrace CityVizor",
			link: ["/admin"]
		},
		titleRight: {
			text: "Zavřít",
			link: ["/"],
			icon: "fa fa-times"
		},
		menu: [
			{ text: "Profily", link: ["/admin/profily"] },
			{ text: "Uživatelé", link: ["/admin/uzivatele"] }
		]
	};

	cat:string;
	
	config:any = AppConfig;

	public isMenuCollapsed: boolean = true;

	constructor(private titleService: Title, private route: ActivatedRoute) {
	}

	ngOnInit(){
		
		this.titleService.setTitle(this.config.title);
		
		this.route.params.forEach((params: Params) => {			
			this.cat = params["cat"];
		});
	}

}