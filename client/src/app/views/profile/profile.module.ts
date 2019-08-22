import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileViewComponent } from 'app/views/profile-view/profile-view.component';

// Data viz components
import { DashboardComponent } from "app/views/profile-view/components/dash-board/dash-board.component";
import { BigBangVizComponent } from 'app/views/profile-view/components/bigbang-viz/bigbang-viz.component';
import { InvoiceListComponent } from 'app/views/profile-view/components/invoice-list/invoice-list.component';
import { NoticeBoardComponent } from "app/views/profile-view/components/notice-board/notice-board.component";
import { ContractListComponent } from "app/views/profile-view/components/contract-list/contract-list.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ProfileViewComponent,
    
    DashboardComponent,
    BigBangVizComponent,
    InvoiceListComponent,
    NoticeBoardComponent,
    ContractListComponent
  ]
})
export class ProfileViewModule { }
