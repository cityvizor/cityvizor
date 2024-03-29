import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "app/services/data.service";

import { Counterparty } from "app/schema/counterparty";

@Component({
  moduleId: module.id,
  selector: "counterparty",
  templateUrl: "counterparty.component.html",
  styleUrls: ["counterparty.component.scss"],
})
export class CounterpartyComponent implements OnInit, OnDestroy {
  counterparty: Counterparty;

  paramsSubscription: Subscription;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.loadCounterparty(params.counterparty);
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadCounterparty(counterpartyId: string) {
    this.counterparty = await this.dataService.getCounterparty(counterpartyId);
  }
}
