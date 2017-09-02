import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

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
  
	constructor(private route: ActivatedRoute) {}

	ngOnInit(){
		this.paramsSubscription = this.route.params.subscribe((params: Params) => {			
			this.cat = params["cat"];
		});
	}

  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }

}