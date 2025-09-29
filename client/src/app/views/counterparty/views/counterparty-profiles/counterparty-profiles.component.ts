import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "app/services/data.service";
import { NgFor } from "@angular/common";

@Component({
    selector: "counterparty-profiles",
    templateUrl: "counterparty-profiles.component.html",
    styleUrls: ["counterparty-profiles.component.scss"],
    standalone: true,
    imports: [NgFor],
})
export class CounterpartyProfilesComponent implements OnInit, OnDestroy {
  budgets: any[];

  paramsSubscription: Subscription;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramsSubscription = this.route.parent!.params.subscribe(
      (params: Params) => {
        // we dont use component somewhere else
        this.loadCounterpartyProfiles(params.counterparty);
      }
    );
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadCounterpartyProfiles(counterpartyId: string) {
    this.budgets =
      await this.dataService.getCounterpartyBudgets(counterpartyId);
  }
}
