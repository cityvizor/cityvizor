import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Import Modules
import { ButtonsModule, CollapseModule, BsDropdownModule, TabsModule } from 'ngx-bootstrap';

// Shared coremponents
<<<<<<< HEAD:src/app/shared/shared.module.ts
import { ChartBigbangComponent } 		from './components/chart-bigbang/chart-bigbang.component';
import { ChartDonutComponent } 		from './components/chart-donut/chart-donut.component';
import { ChartBudgetComponent } 		from './components/chart-budget/chart-budget.component';
import { ChartEventOverviewComponent } 		from './components/chart-event-overview/chart-event-overview.component';
import { BudgetsListComponent } 		from './components/budgets-list/budgets-list.component';
import { HelpModalComponent } 		from './components/help-modal/help-modal.component';
import { ChartHistoryComponent } 		from './components/chart-history/chart-history.component';
=======
import { ChartBigbangComponent } 		from './shared/components/chart-bigbang/chart-bigbang.component';
import { ChartDonutComponent } 		from './shared/components/chart-donut/chart-donut.component';
import { ChartBudgetComponent } 		from './shared/components/chart-budget/chart-budget.component';
import { ChartEventOverviewComponent } 		from './shared/components/chart-event-overview/chart-event-overview.component';
import { BudgetsListComponent } 		from './shared/components/budgets-list/budgets-list.component';
import { HelpModalComponent } 		from './shared/components/help-modal/help-modal.component';
import { ChartHistoryComponent } 		from './shared/components/chart-history/chart-history.component';
>>>>>>> origin/development:src/module.shared.ts

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
    /* Shared Components */ ChartBigbangComponent, ChartDonutComponent, ChartBudgetComponent, ChartEventOverviewComponent, BudgetsListComponent, HelpModalComponent, ChartHistoryComponent,
    /* Shared Pipes */ MoneyPipe, IcoPipe, AbsPipe, ConcatPipe, ArrayChildrenPipe, AddressPipe, PostalCodePipe, ArrayPipe
  ],
  exports: [
    FormsModule,
    ButtonsModule, CollapseModule, BsDropdownModule, TabsModule,
    /* Shared Components */ ChartBigbangComponent, ChartDonutComponent, ChartBudgetComponent, ChartEventOverviewComponent, BudgetsListComponent, HelpModalComponent, ChartHistoryComponent,
    /* Shared Pipes */ MoneyPipe, IcoPipe, AbsPipe, ConcatPipe, ArrayChildrenPipe, AddressPipe, PostalCodePipe, ArrayPipe
  ]
})
export class SharedModule { }