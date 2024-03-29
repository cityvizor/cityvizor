import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "app/shared/shared.module";
import { ProfileRoutingModule } from "./profile-routing.module";

import { ProfileComponent } from "app/views/profile/profile.component";

// Views
import { ProfileDashboardComponent } from "./views/profile-dashboard/profile-dashboard.component";
import { ProfileAccountingComponent } from "./views/profile-accounting/profile-accounting.component";
import { ProfileInvoicesComponent } from "./views/profile-invoices/profile-invoices.component";
import { ProfileNoticeboardComponent } from "./views/profile-noticeboard/profile-noticeboard.component";
import { ProfileContractsComponent } from "./views/profile-contracts/profile-contracts.component";
import { ProfileCounterpartiesComponent } from "./views/profile-counterparties/profile-counterparties.component";
import { BudgetSelectComponent } from "./components/budget-select/budget-select.component";
import { GroupSelectComponent } from "./components/group-select/group-select.component";

// Components

// Components

@NgModule({
  imports: [CommonModule, SharedModule, ProfileRoutingModule],
  declarations: [
    ProfileComponent,

    ProfileDashboardComponent,
    ProfileAccountingComponent,
    ProfileInvoicesComponent,
    ProfileNoticeboardComponent,
    ProfileContractsComponent,
    ProfileCounterpartiesComponent,

    BudgetSelectComponent,
    GroupSelectComponent,
  ],
})
export class ProfileModule {}
