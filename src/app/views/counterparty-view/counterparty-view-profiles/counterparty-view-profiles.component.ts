import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "app/services/data.service";

import { Counterparty } from "app/shared/schema/counterparty";

@Component({
  moduleId: module.id,
  selector: 'counterparty-view-profiles',
  templateUrl: 'counterparty-view-profiles.component.html',
  styleUrls: ['counterparty-view-profiles.component.css'],
})
export class CounterpartyViewProfilesComponent implements OnInit {

  profiles:any[];
  
  paramsSubscription:Subscription;

  constructor(private dataService:DataService, private route:ActivatedRoute){

  }


  ngOnInit(){

    this.paramsSubscription = this.route.parent.params.subscribe((params:Params) => {
      this.loadCounterpartyProfiles(params.counterparty);
    });

  }

  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }

  async loadCounterpartyProfiles(counterpartyId:string){
    this.profiles = await this.dataService.getCounterpartyProfiles(counterpartyId);
  }
}
