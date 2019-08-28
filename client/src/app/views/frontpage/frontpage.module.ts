import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { FrontpageComponent } from './frontpage.component';

import { CounterpartySearchComponent } from './views/counterparty-search/counterparty-search.component';
import { ProfileSearchComponent } from './views/profile-search/profile-search.component';

@NgModule({
  declarations: [
    FrontpageComponent,
    ProfileSearchComponent,
    CounterpartySearchComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ]
})
export class FrontpageModule { }
