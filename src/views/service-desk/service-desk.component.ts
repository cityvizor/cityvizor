import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Subscription } from 'rxjs/Subscription' ;

import { UserService } 		from '../../services/user.service';

//00006947
@Component({
	moduleId: module.id,
	selector: 'service-desk',
	templateUrl: 'service-desk.template.html',
	styleUrls: ['service-desk.style.css']
})
export class ServiceDeskComponent implements OnInit, OnDestroy {
  
  menu = {
    title: {
      text: "Service Desk",
      link: ["../"]
    },
    titleRight: {
      text: "Zavřít",
      link: ["/"],
      icon: "fa fa-times"
    },
    menu: [
      { text: "Můj účet", link: ["../ucet"] },
      { text: "Připomínky a požadavky", link: ["../pozadavky"] },
      { text: "Návody", link: ["../navody"] }
    ]
  };

  cat:string;

  paramsSubscription:Subscription;
  
	constructor(private route: ActivatedRoute, public userService:UserService) {
		
	}

	ngOnInit(){
		this.paramsSubscription = this.route.params.subscribe((params: Params) => {			
			this.cat = params["cat"];
		});
	}

  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }

}