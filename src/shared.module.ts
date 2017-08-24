import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';

// Import Modules
import { CollapseModule, BsDropdownModule, TabsModule } from 'ngx-bootstrap';

// Shared coremponents
import { ChartBigbangComponent } 		from './shared/components/chart-bigbang/chart-bigbang.component';
import { ChartDonutComponent } 		from './shared/components/chart-donut/chart-donut.component';
import { ChartBudgetComponent } 		from './shared/components/chart-budget/chart-budget.component';
import { BudgetsListComponent } 		from './shared/components/budgets-list/budgets-list.component';
import { HelpModalComponent } 		from './shared/components/help-modal/help-modal.component';

// Pipes
import { MoneyPipe } from './shared/pipes/money.pipe';
import { AddressPipe, PostalCodePipe } from './shared/pipes/address.pipe';
import { IcoPipe, AbsPipe, ConcatPipe, ArrayChildrenPipe, ArrayPipe } from './shared/pipes/utils.pipe';

@NgModule({
  imports:      [
    CommonModule,
    CollapseModule.forRoot(), BsDropdownModule.forRoot(), TabsModule.forRoot()
  ],
  declarations: [
    /* Shared Components */ ChartBigbangComponent, ChartDonutComponent, ChartBudgetComponent, BudgetsListComponent, HelpModalComponent,
    /* Shared Pipes */ MoneyPipe, IcoPipe, AbsPipe, ConcatPipe, ArrayChildrenPipe, AddressPipe, PostalCodePipe, ArrayPipe
  ],
  exports: [
    CollapseModule, BsDropdownModule, TabsModule,
    /* Shared Components */ ChartBigbangComponent, ChartDonutComponent, ChartBudgetComponent, BudgetsListComponent, HelpModalComponent,
    /* Shared Pipes */ MoneyPipe, IcoPipe, AbsPipe, ConcatPipe, ArrayChildrenPipe, AddressPipe, PostalCodePipe, ArrayPipe
  ]
})
export class SharedModule { }