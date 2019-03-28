import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Import Modules
import { ButtonsModule, CollapseModule, BsDropdownModule, TabsModule } from 'ngx-bootstrap';

// Shared coremponents
import { ChartBigbangComponent } 		from './components/chart-bigbang/chart-bigbang.component';
import { ChartDonutComponent } 		from './components/chart-donut/chart-donut.component';
import { ChartBudgetComponent } 		from './components/chart-budget/chart-budget.component';
import { ChartEventOverviewComponent } 		from './components/chart-event-overview/chart-event-overview.component';
import { BudgetsListComponent } 		from './components/budgets-list/budgets-list.component';
import { HelpModalComponent } 		from './components/help-modal/help-modal.component';
import { ChartHistoryComponent } 		from './components/chart-history/chart-history.component';
import { WordCloudComponent } from "./components/word-cloud/word-cloud.component";

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
    /* Shared Components */ ChartBigbangComponent, ChartDonutComponent, ChartBudgetComponent, ChartEventOverviewComponent, BudgetsListComponent, HelpModalComponent, ChartHistoryComponent, WordCloudComponent,
    /* Shared Pipes */ MoneyPipe, IcoPipe, AbsPipe, ConcatPipe, ArrayChildrenPipe, AddressPipe, PostalCodePipe, ArrayPipe
  ],
  exports: [
    FormsModule,
    ButtonsModule, CollapseModule, BsDropdownModule, TabsModule,
    /* Shared Components */ ChartBigbangComponent, ChartDonutComponent, ChartBudgetComponent, ChartEventOverviewComponent, BudgetsListComponent, HelpModalComponent, ChartHistoryComponent, WordCloudComponent,
    /* Shared Pipes */ MoneyPipe, IcoPipe, AbsPipe, ConcatPipe, ArrayChildrenPipe, AddressPipe, PostalCodePipe, ArrayPipe
  ]
})
export class SharedModule { }