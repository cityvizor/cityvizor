import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile.component';

import { ProfileDashboardComponent } from './views/profile-dashboard/profile-dashboard.component';
import { ProfileAccountingComponent } from './views/profile-accounting/profile-accounting.component';
import { ProfileInvoicesComponent } from './views/profile-invoices/profile-invoices.component';
import { ProfileNoticeboardComponent } from './views/profile-noticeboard/profile-noticeboard.component';
import { ProfileContractsComponent } from './views/profile-contracts/profile-contracts.component';
import { ProfileCounterpartiesComponent } from './views/profile-counterparties/profile-counterparties.component';
import { NotFoundPageComponent } from '../not-found-page/not-found-page.component';


const routes: Routes = [
  {
    path: "",
    component: ProfileComponent,
    children: [
      { path: "prehled", component: ProfileDashboardComponent },
      { path: "hospodareni/:type", component: ProfileAccountingComponent },
      { path: "faktury", component: ProfileInvoicesComponent },
      { path: "uredni-deska", component: ProfileNoticeboardComponent },
      { path: "registr-smluv", component: ProfileContractsComponent },
      { path: "dodavatele", component: ProfileCounterpartiesComponent },
      { path: "", redirectTo: "prehled", pathMatch: "full" },
      { path: '**', pathMatch: 'full', redirectTo: '/not-found' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
