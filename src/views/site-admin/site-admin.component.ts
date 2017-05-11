import { Component, trigger, state, style, transition, animate } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { UserService } 		from '../../services/user.service';

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

	constructor(private route: ActivatedRoute, public userService:UserService) {
		
		if(userService.acl('profile-admin')) this.menuConfig.menu.push({ text: "Profily", link: ["../profily"] });
		if(userService.acl('user-admin')) this.menuConfig.menu.push({ text: "Uživatelé", link: ["../uzivatele"] });
		if(userService.acl('entities-admin')) this.menuConfig.menu.push({ text: "Obce", link: ["../obce"] });
		
	}

	ngOnInit(){
		this.route.params.forEach((params: Params) => {			
			this.cat = params["cat"];
		});
	}

}