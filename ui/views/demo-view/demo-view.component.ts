import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title }     from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { DataService } from "../../services/data.service";

@Component({
	moduleId: module.id,
	selector: 'demo-view',
	templateUrl: 'demo-view.template.html',
	styleUrls: ['demo-view.style.css'],
})
export class DemoViewComponent implements OnInit, OnDestroy {

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