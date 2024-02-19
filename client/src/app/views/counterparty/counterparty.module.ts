import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CounterpartyRoutingModule } from "./counterparty-routing.module";

import { CounterpartyComponent } from "./counterparty.component";

import { CounterpartyDashboardComponent } from "./views/counterparty-dashboard/counterparty-dashboard.component";
import { CounterpartyPaymentsComponent } from "./views/counterparty-payments/counterparty-payments.component";
import { CounterpartyProfilesComponent } from "./views/counterparty-profiles/counterparty-profiles.component";
import { SharedModule } from "app/shared/shared.module";

@NgModule({
  declarations: [
    CounterpartyComponent,
    CounterpartyDashboardComponent,
    CounterpartyPaymentsComponent,
    CounterpartyProfilesComponent,
  ],
  imports: [CommonModule, CounterpartyRoutingModule, SharedModule],
})
export class CounterpartyModule {}
