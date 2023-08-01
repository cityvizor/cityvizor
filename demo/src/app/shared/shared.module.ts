import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import Modules
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ModalModule } from "ngx-bootstrap/modal";

// Shared coremponents
import { ChartBigbangComponent } 		from './components/chart-bigbang/chart-bigbang.component';
import { ChartDonutComponent } 		from './components/chart-donut/chart-donut.component';
import { ChartBudgetComponent } 		from './components/chart-budget/chart-budget.component';
import { ChartEventOverviewComponent } 		from './components/chart-event-overview/chart-event-overview.component';
import { BudgetsListComponent } 		from './components/budgets-list/budgets-list.component';
import { HelpModalComponent } 		from './components/help-modal/help-modal.component';

// Pipes
import { MoneyPipe } from './pipes/money.pipe';
import { AddressPipe, PostalCodePipe } from './pipes/address.pipe';
import { IcoPipe, AbsPipe, ConcatPipe, ArrayChildrenPipe, ArrayPipe } from './pipes/utils.pipe';


@NgModule({
  imports:      [
    CommonModule,
    FormsModule,
    CollapseModule.forRoot(), BsDropdownModule.forRoot(), TabsModule.forRoot(), ModalModule.forRoot()
  ],
  declarations: [
    /* Shared Components */ ChartBigbangComponent, ChartDonutComponent, ChartBudgetComponent, ChartEventOverviewComponent, BudgetsListComponent, HelpModalComponent,
    /* Shared Pipes */ MoneyPipe, IcoPipe, AbsPipe, ConcatPipe, ArrayChildrenPipe, AddressPipe, PostalCodePipe, ArrayPipe
  ],
  exports: [
    FormsModule,
    CollapseModule, BsDropdownModule, TabsModule, ModalModule,
    /* Shared Components */ ChartBigbangComponent, ChartDonutComponent, ChartBudgetComponent, ChartEventOverviewComponent, BudgetsListComponent, HelpModalComponent,
    /* Shared Pipes */ MoneyPipe, IcoPipe, AbsPipe, ConcatPipe, ArrayChildrenPipe, AddressPipe, PostalCodePipe, ArrayPipe
  ]
})
export class SharedModule { }