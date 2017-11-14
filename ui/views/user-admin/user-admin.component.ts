import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title }     from '@angular/platform-browser';

import { AppConfig, IAppConfig } from '../../config/config';
import { Subscription } from 'rxjs/Subscription' ;

@Component({
	moduleId: module.id,
	selector: 'user-admin',
	templateUrl: 'user-admin.template.html'
})
export class UserAdminComponent implements OnInit, OnDestroy {
  
  menu = {
    title: {
      text: "Správa účtu",
      link: ["../"]
    },
    titleRight: {
      text: "Zavřít",
      link: ["/"],
      icon: "fa fa-times"
    },
    menu: [
      { text: "Můj účet", link: ["../nastaveni"] },
			{ text: "Upozornění", link: ["../upozorneni"] }
    ]
  };

  cat:string;
	
  paramsSubscription:Subscription;
  
	constructor(private titleService: Title, private route: ActivatedRoute, @Inject(AppConfig) public config:IAppConfig) {}

	ngOnInit(){
		this.titleService.setTitle(this.config.title);
		
		this.paramsSubscription = this.route.params.subscribe((params: Params) => {			
			this.cat = params["cat"];
		});
	}

  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }

}