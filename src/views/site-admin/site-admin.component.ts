import { Component, trigger, state, style, transition, animate } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title }     from '@angular/platform-browser';

import { AppConfig } from '../../config/app-config';
import { ACLService } 		from '../../services/acl.service';

//00006947
@Component({
	moduleId: module.id,
	selector: 'site-admin',
	templateUrl: 'site-admin.template.html',
	styleUrls: ['site-admin.style.css']
})
export class SiteAdminComponent {

	menuConfig = {
		title: {
			text: "Administrace CityVizor",
			link: ["../"]
		},
		titleRight: {
			text: "Zavřít",
			link: ["/"],
			icon: "fa fa-times"
		},
		menu: [
			{ text: "Profily", link: ["../profily"] },
			{ text: "Uživatelé", link: ["../uzivatele"] }
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