import { Component, Input, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs'

import { ACLService } 		from '../../../services/acl.service';

import { AppConfig, IAppConfig, Module } from '../../../config/config';

//00006947
@Component({
	moduleId: module.id,
	selector: 'profile-header',
	templateUrl: 'profile-header.template.html',
	styleUrls: ['profile-header.style.css']
})
export class ProfileHeaderComponent {

	@Input()
  profile:any;
	
	year:number;
	 
	vizModules:Module[];
	 
	public isMenuCollapsed: boolean = true;
	
	paramsSubscription: Subscription;
	 
	constructor(public aclService:ACLService, private route: ActivatedRoute, @Inject(AppConfig) config: IAppConfig) {
		this.vizModules = config.modules;
	}
	
	ngOnInit(){
		this.paramsSubscription = this.route.params.subscribe((params: Params) => {
			this.year = params["rok"];
		});
	}

	isHiddenModule(viz){
		return this.profile.hiddenModules && this.profile.hiddenModules.indexOf(viz.id) >= 0;
	}
	
	getVizLink(viz){
		
		let url = '/' + this.profile.url + '/' + viz.url;
		
		if(this.year && viz.url.match(/(vydaje|faktury|prijmy)/)) return [url, {"rok": this.year}];
		return [url];
	}
	
	getAdminLink(){
		return '/' + this.profile.url + '/admin';
	}
	
	isAdmin(){
		return this.aclService.checkRoute(this.getAdminLink(),{profile:this.profile._id})
	}

}