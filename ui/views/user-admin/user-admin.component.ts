import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title }     from '@angular/platform-browser';

import { AppConfig } from '../../config/app-config';
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
	
	config:any = AppConfig;

  paramsSubscription:Subscription;
  
	constructor(private titleService: Title, private route: ActivatedRoute) {}

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