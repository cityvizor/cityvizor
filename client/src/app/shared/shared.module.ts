import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Import Modules
import { ButtonsModule, CollapseModule, BsDropdownModule, TabsModule, ModalModule } from 'ngx-bootstrap';

// Shared coremponents
import { BudgetsListComponent } from './components/budgets-list/budgets-list.component';
import { ChartBigbangComponent } from './components/chart-bigbang/chart-bigbang.component';
import { ChartDonutComponent } from './components/chart-donut/chart-donut.component';
import { ChartBudgetComponent } from './components/chart-budget/chart-budget.component';
import { ChartEventOverviewComponent } from './components/chart-event-overview/chart-event-overview.component';
import { ChartHistoryComponent } from './components/chart-history/chart-history.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { HelpModalComponent } from './components/help-modal/help-modal.component';
import { WordCloudComponent } from "./components/word-cloud/word-cloud.component";
import { LoginFormComponent } from 'app/shared/components/login-form/login-form.component';
import { HeaderMenuComponent } from 'app/shared/components/header-menu/header-menu.component';
import { ProfileHeaderComponent } from 'app/shared/components/profile-header/profile-header.component';

// Pipes
import { MoneyPipe } from './pipes/money.pipe';
import { AddressPipe, PostalCodePipe } from './pipes/address.pipe';
import { IcoPipe, AbsPipe, ConcatPipe, ArrayChildrenPipe, ArrayPipe } from './pipes/utils.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonsModule.forRoot(), CollapseModule.forRoot(), BsDropdownModule.forRoot(), TabsModule.forRoot()
  ],
  declarations: [
    
    /* Charts */
    ChartBigbangComponent,
    ChartDonutComponent,
    ChartBudgetComponent,
    ChartEventOverviewComponent,

    /* Components */
    BudgetsListComponent,
    EventDetailComponent,
    HelpModalComponent,
    ChartHistoryComponent,
    WordCloudComponent,
    LoginFormComponent,
    HeaderMenuComponent,
    ProfileHeaderComponent,
    
    /* Pipes */
    MoneyPipe,
    IcoPipe, AbsPipe, ConcatPipe, ArrayChildrenPipe, AddressPipe, PostalCodePipe, ArrayPipe
  ],
  exports: [

    /* Angular */
    FormsModule,
    
    /* Bootstrap */
    ButtonsModule, CollapseModule, BsDropdownModule, TabsModule, ModalModule,

    /* Charts */
    ChartBigbangComponent,
    ChartDonutComponent,
    ChartBudgetComponent,
    ChartEventOverviewComponent,

    /* Components */
    BudgetsListComponent,
    EventDetailComponent,
    HelpModalComponent,
    ChartHistoryComponent,
    WordCloudComponent,
    LoginFormComponent,
    HeaderMenuComponent,
    ProfileHeaderComponent,

    /* Pipes */ 
    MoneyPipe,
    IcoPipe, AbsPipe, ConcatPipe, ArrayChildrenPipe, AddressPipe, PostalCodePipe, ArrayPipe
  ]
})
export class SharedModule { }