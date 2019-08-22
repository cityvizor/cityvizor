import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Title }     from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { DataService } 		from 'app/services/data.service';
import { ToastService } 		from 'app/services/toast.service';

import { AppConfig, IAppConfig, Module } from 'config/config';

@Component({
	moduleId: module.id,
	selector: 'profile',
	templateUrl: 'profile.component.html',
	styleUrls: ['profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {

	profile: any;
	
	modules: Module[];

	activeModule:string;
	
	year = 2016;
	
	paramsSubscription:Subscription;
	
	constructor(private titleService: Title, private route: ActivatedRoute, private dataService: DataService, private toastService: ToastService, private router:Router, @Inject(AppConfig) private config: IAppConfig) {
		
		this.modules = config.modules;	
		
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