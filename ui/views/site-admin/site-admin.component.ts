import { Component, trigger, state, style, transition, animate } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

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

	public isMenuCollapsed: boolean = true;

	constructor(private route: ActivatedRoute) {
	}

	ngOnInit(){
		this.route.params.forEach((params: Params) => {			
			this.cat = params["cat"];
		});
	}

}