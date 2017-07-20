import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription' ;

@Component({
  selector: 'embed-large',
  templateUrl: './embed-large.template.html',
  styleUrls: ['./embed-large.style.css']
})
export class EmbedLargeComponent implements OnInit {

  profileId:string;
  
  constructor(private route:ActivatedRoute) { }
  
  // store siubscription to unsubscribe on destroy
  paramsSubscription:Subscription;

  ngOnInit(){
		this.paramsSubscription = this.route.params.subscribe((params: Params) => {		
      
      if(params["profile"] !== this.profileId){
        this.profileId = params["profile"];
        this.loadData();
      }
      
    });
  }
  
  ngOnDestroy(){
		this.paramsSubscription.unsubscribe();
	}
  
  loadData(){
    }
}
