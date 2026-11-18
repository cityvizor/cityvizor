import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "app/services/data.service";

@Component({
  selector: "counterparty-profiles",
  templateUrl: "counterparty-profiles.component.html",
  styleUrls: ["counterparty-profiles.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class CounterpartyProfilesComponent implements OnInit, OnDestroy {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  budgets: any[];

  paramsSubscription: Subscription;

  ngOnInit() {
    this.paramsSubscription = this.route.parent!.params.subscribe(
      (params: Params) => {
        // we dont use component somewhere else
        this.loadCounterpartyProfiles(params.counterparty);
      },
    );
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadCounterpartyProfiles(counterpartyId: string) {
    this.budgets =
      await this.dataService.getCounterpartyBudgets(counterpartyId);

    this.changeDetectorRef.markForCheck();
  }
}
