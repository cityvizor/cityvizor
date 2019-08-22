import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CounterpartyComponent } from './counterparty.component';

import { CounterpartyProfilesComponent } from './counterparty-profiles/counterparty-profiles.component';
import { CounterpartyPaymentsComponent } from './counterparty-payments/counterparty-payments.component';
import { CounterpartyDashboardComponent } from './counterparty-dashboard/counterparty-dashboard.component';

const routes: Routes = [
  {
    path: "",
    component: CounterpartyComponent,
    children: [
      { path: 'obce', component: CounterpartyProfilesComponent },
      { path: 'faktury', component: CounterpartyPaymentsComponent },
      { path: 'prehled', component: CounterpartyDashboardComponent },
      { path: '', redirectTo: 'prehled', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CounterpartyRoutingModule { }
