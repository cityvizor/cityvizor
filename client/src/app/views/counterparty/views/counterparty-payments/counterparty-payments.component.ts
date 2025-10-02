import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "app/services/data.service";
import { DatePipe } from "@angular/common";
import { MoneyPipe } from "../../../../shared/pipes/money.pipe";

@Component({
    selector: "app-counterparty-payments",
    templateUrl: "./counterparty-payments.component.html",
    styleUrls: ["./counterparty-payments.component.scss"],
    imports: [
        DatePipe,
        MoneyPipe
    ]
})
export class CounterpartyPaymentsComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  payments: any[] = [];

  paramsSubscription: Subscription;

  ngOnInit() {
    this.paramsSubscription = this.route.parent!.params.subscribe(
      (params: Params) => {
        // we dont use component somewhere else
        this.loadPayments(params.counterparty);
      }
    );
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadPayments(counterpartyId: string) {
    this.payments =
      await this.dataService.getCounterpartyPayments(counterpartyId);
  }
}
