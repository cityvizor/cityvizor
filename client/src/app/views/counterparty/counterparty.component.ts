import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "../../services/data.service";

import { Counterparty } from "../../schema/counterparty";

@Component({
  moduleId: module.id,
  selector: 'counterparty',
  templateUrl: 'counterparty.component.html',
  styleUrls: ['counterparty.component.scss'],
})
export class CounterpartyComponent implements OnInit, OnDestroy {

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
      { text: "Přehled", link: ["./prehled"] },
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
    
    this.menuConfig.title.text = this.counterparty.name;
  }
}
