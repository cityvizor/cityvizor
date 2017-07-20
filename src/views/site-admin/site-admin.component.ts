import { Component, trigger, state, style, transition, animate } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { AuthService } 		from '../../services/auth.service';

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
		menu: []
	};

	cat:string;

	public isMenuCollapsed: boolean = true;

	constructor(private route: ActivatedRoute, public authService:AuthService) {
		
		if(authService.acl('profile-admin')) this.menuConfig.menu.push({ text: "Profily", link: ["../profily"] });
		if(authService.acl('user-admin')) this.menuConfig.menu.push({ text: "Uživatelé", link: ["../uzivatele"] });
		
	}

	ngOnInit(){
		this.route.params.forEach((params: Params) => {			
			this.cat = params["cat"];
		});
	}

}