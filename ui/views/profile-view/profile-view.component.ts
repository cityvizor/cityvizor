import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Title }     from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { DataService } 		from '../../services/data.service';
import { ToastService } 		from '../../services/toast.service';

import { AppConfig } from '../../config/app-config';
import { Module, MODULES } from "../../shared/data/modules";

//00006947
@Component({
	moduleId: module.id,
	selector: 'profile-view',
	templateUrl: 'profile-view.template.html',
	styleUrls: ['profile-view.style.css'],
})
export class ProfileViewComponent implements OnInit, OnDestroy {

	profile: any;
	
	modules: Module[];

	activeModule:string;
	
	year = 2016;
	
	config:any = AppConfig;

	paramsSubscription:Subscription

	constructor(private titleService: Title, private route: ActivatedRoute, private dataService: DataService, private toastService: ToastService, private router:Router) {
		
		this.modules = MODULES;	
		
	}

	ngOnInit(){
		this.paramsSubscription = this.route.params.subscribe((params: Params) => {
			if(!this.profile || this.profile.url !== params["profile"]) {
				
				this.dataService.getProfile(params["profile"])
					.then(profile => {
						this.profile = profile;
					
						this.titleService.setTitle(profile.name + " :: " + this.config.title);
					})
					.catch(err => {
						if(err.status === 404){
							this.toastService.toast("Obec nenalezena.","error");
						}
						else{
							this.toastService.toast("Nastala chyba při stahování dat obce.","error");
						}

						this.router.navigate(["/"]);

					});
			}

			this.setModule(params["module"]);

		});
	}

	ngOnDestroy(){
		this.paramsSubscription.unsubscribe();
	}
	
	setModule(moduleUrl:string):void{
		
		if(moduleUrl === "prehled"){
			this.activeModule = "dash-board";
			return;
		}

		this.modules.some(item => {
			if(item.url === moduleUrl){
				this.activeModule = item.id;
				return true;
			}
		});
	}
	
	getModuleMenuItem(viz){
		return {
			text: viz.name,
			link: ["/profil/" + this.profile.url + "/" + viz.url]
		};
	}

}