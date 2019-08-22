import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CounterpartyRoutingModule } from './counterparty-routing.module';

import { CounterpartyComponent } from './counterparty.component';

import { CounterpartyDashboardComponent } from './counterparty-dashboard/counterparty-dashboard.component';
import { CounterpartyPaymentsComponent } from './counterparty-payments/counterparty-payments.component';
import { CounterpartyProfilesComponent } from './counterparty-profiles/counterparty-profiles.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [
    CounterpartyComponent,
    CounterpartyDashboardComponent,
    CounterpartyPaymentsComponent,
    CounterpartyProfilesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CounterpartyRoutingModule
  ]
})
export class CounterpartyModule { }
