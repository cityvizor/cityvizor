import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { ActivatedRoute, Params, RouterLink, RouterOutlet } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "app/services/data.service";

import { Counterparty } from "app/schema/counterparty";
import { HeaderMenuComponent } from "../../shared/components/header-menu/header-menu.component";

@Component({
    selector: "counterparty",
    templateUrl: "counterparty.component.html",
    styleUrls: ["counterparty.component.scss"],
    imports: [
        HeaderMenuComponent,
        RouterLink,
        RouterOutlet,
    ]
})
export class CounterpartyComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  counterparty: Counterparty;

  paramsSubscription: Subscription;

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
