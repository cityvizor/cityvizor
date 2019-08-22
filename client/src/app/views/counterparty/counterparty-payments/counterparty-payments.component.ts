import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "app/services/data.service";

@Component({
  selector: 'app-counterparty-payments',
  templateUrl: './counterparty-payments.component.html',
  styleUrls: ['./counterparty-payments.component.css']
})
export class CounterpartyPaymentsComponent implements OnInit, OnDestroy {

  payments:any[] = [];

  paramsSubscription:Subscription;

  constructor(private dataService:DataService, private route:ActivatedRoute) { }

  ngOnInit(){
    this.paramsSubscription = this.route.parent.params.subscribe((params:Params) => {
      this.loadPayments(params.counterparty);
    });
  }

  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }

  async loadPayments(counterpartyId:string){
    this.payments = await this.dataService.getCounterpartyPayments(counterpartyId);
  }

}
