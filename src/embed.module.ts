import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule, Http, RequestOptions }     from '@angular/http';

import { AppComponent }  from './embed.component';

// Views components
import { EmbedLargeComponent } 		from './embed/embed-large/embed-large.component';
// Data viz components

// Services
import { DataService } 		from './services/data.service';

// Shared coremponents
import { ChartBigbangComponent } 		from './shared/components/chart-bigbang/chart-bigbang.component';
import { ChartDonutComponent } 		from './shared/components/chart-donut/chart-donut.component';
import { ChartBudgetComponent } 		from './shared/components/chart-budget/chart-budget.component';
import { BudgetsListComponent } 		from './shared/components/budgets-list/budgets-list.component';

// Pipes
import { MoneyPipe } from './shared/pipes/money.pipe';
import { ConcatPipe, ArrayChildrenPipe, ArrayPipe } from './shared/pipes/utils.pipe';

// Routes
//import { routing } from './embed.routing';

@NgModule({
  imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpModule
	],
  declarations: [
		AppComponent,
		/* Views */ EmbedLargeComponent,
		/* Shared Components */ ChartBigbangComponent, ChartDonutComponent, ChartBudgetComponent, BudgetsListComponent, 
		/* PIPES */ MoneyPipe, ConcatPipe, ArrayChildrenPipe, ArrayPipe
	],
	providers: [
		DataService
	],
  bootstrap: [ AppComponent ]
})
export class AppModule { }