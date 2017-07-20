import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';

// Shared coremponents
import { ChartBigbangComponent } 		from './shared/components/chart-bigbang/chart-bigbang.component';
import { ChartDonutComponent } 		from './shared/components/chart-donut/chart-donut.component';
import { ChartBudgetComponent } 		from './shared/components/chart-budget/chart-budget.component';
import { BudgetsListComponent } 		from './shared/components/budgets-list/budgets-list.component';

// Pipes
import { MoneyPipe } from './shared/pipes/money.pipe';
import { AddressPipe, PostalCodePipe } from './shared/pipes/address.pipe';
import { ConcatPipe, ArrayChildrenPipe, ArrayPipe } from './shared/pipes/utils.pipe';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [
    /* Shared Components */ ChartBigbangComponent, ChartDonutComponent, ChartBudgetComponent, BudgetsListComponent,
    /* Shared Pipes */ MoneyPipe, ConcatPipe, ArrayChildrenPipe, AddressPipe, PostalCodePipe, ArrayPipe
  ],
  exports: [
    /* Shared Components */ ChartBigbangComponent, ChartDonutComponent, ChartBudgetComponent, BudgetsListComponent,
    /* Shared Pipes */ MoneyPipe, ConcatPipe, ArrayChildrenPipe, AddressPipe, PostalCodePipe, ArrayPipe
  ]
})
export class SharedModule { }