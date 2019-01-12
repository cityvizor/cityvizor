import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "../../services/data.service";

import { Counterparty } from "../../shared/schema/counterparty";

@Component({
  moduleId: module.id,
  selector: 'counterparty-view',
  templateUrl: 'counterparty-view.component.html',
  styleUrls: ['counterparty-view.component.css'],
})
export class CounterpartyViewComponent implements OnInit, OnDestroy {

  menuConfig = {
    title: {
      text: "Dodavatel: ...",
      link: ["./"]
    },
    titleRight: {
      text: "Zavřít",
      link: ["/"],
      icon: "fa fa-times"
    },
    menu: [
      { text: "Obce", link: ["./obce"] },
      { text: "Faktury", link: ["./faktury"] }
    ]
  };
  
  counterparty:Counterparty;

  paramsSubscription:Subscription;

  constructor(private dataService:DataService, private route:ActivatedRoute){

  }


  ngOnInit(){

    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      this.loadCounterparty(params.counterparty);
    });

  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }

  async loadCounterparty(counterpartyId:string){
    this.counterparty = await this.dataService.getCounterparty(counterpartyId)
    
    this.menuConfig.title.text = "Dodavatel: " + this.counterparty.name;
  }
}
