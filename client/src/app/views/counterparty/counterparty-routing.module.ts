import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CounterpartyComponent } from './counterparty.component';

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
