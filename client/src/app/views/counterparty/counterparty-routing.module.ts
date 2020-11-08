import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CounterpartyComponent } from './counterparty.component';

import { CounterpartyProfilesComponent } from './views/counterparty-profiles/counterparty-profiles.component';
import { CounterpartyPaymentsComponent } from './views/counterparty-payments/counterparty-payments.component';
import { CounterpartyDashboardComponent } from './views/counterparty-dashboard/counterparty-dashboard.component';
import { NotFoundPageComponent } from '../not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: "",
    component: CounterpartyComponent,
    children: [
      { path: 'obce', component: CounterpartyProfilesComponent },
      { path: 'faktury', component: CounterpartyPaymentsComponent },
      { path: 'prehled', component: CounterpartyDashboardComponent },
      { path: '', redirectTo: 'prehled', pathMatch: 'full' },
      { path: '**', pathMatch: 'full', component: NotFoundPageComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CounterpartyRoutingModule { }
