import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title }     from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { DataService } from "../../services/data.service";

@Component({
	selector: 'profile',
	templateUrl: 'profile.component.html',
	styleUrls: ['profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {

	profile: any = {};
	
	isMenuCollapsed:boolean = false;
	
	activeModule:string;
	
	paramsSubscription:Subscription;
	
	constructor(private titleService: Title, private route: ActivatedRoute, private dataService:DataService) {
	}

	ngOnInit(){
		this.dataService.getProfile(null).then(profile => this.profile = profile);
		
		this.paramsSubscription = this.route.params.subscribe((params: Params) => {
			this.activeModule = params["module"];
		});
	}

	ngOnDestroy(){
		this.paramsSubscription.unsubscribe();
	}

}