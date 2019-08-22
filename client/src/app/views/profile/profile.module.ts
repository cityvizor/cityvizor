import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';

import { ProfileComponent } from 'app/views/profile/profile.component';

// Data viz components
import { DashboardComponent } from "./components/dash-board/dash-board.component";
import { BigBangVizComponent } from "./components/bigbang-viz/bigbang-viz.component";
import { InvoiceListComponent } from "./components/invoice-list/invoice-list.component";
import { NoticeBoardComponent } from "./components/notice-board/notice-board.component";
import { ContractListComponent } from "./components/contract-list/contract-list.component";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProfileRoutingModule
  ],
  declarations: [
    ProfileComponent,
    
    DashboardComponent,
    BigBangVizComponent,
    InvoiceListComponent,
    NoticeBoardComponent,
    ContractListComponent
  ]
})
export class ProfileModule { }
