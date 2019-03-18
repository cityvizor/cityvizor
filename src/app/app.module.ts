import { NgModule }      from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { SharedModule } from './shared/shared.module';

import { AppComponent }  from './app.component';

// Demo specific
import { DemoHomeComponent }  from './views/demo-home/demo-home.component';
import { DemoViewComponent } from './views/demo-view/demo-view.component';
import { DemoConfigComponent }  from './views/demo-config/demo-config.component';
import { DemoDataService } 		from './services/demo-data.service';
import { DemoCodelistService } 		from './services/demo-codelist.service';
import { PapaParseModule } from 'ngx-papaparse';

// Views components
import { EventDetailComponent } from "./views/event-detail/event-detail.component";

// Data viz components
import { ExpenditureVizComponent } from './views/profile-view/expenditure-viz/expenditure-viz.component';
import { IncomeVizComponent } from './views/profile-view/income-viz/income-viz.component';

// Services
import { DataService } 		from './services/data.service';
import { CodelistService } 		from './services/codelist.service';
import { ToastService } 		from './services/toast.service';

// Import Modules
import { ModalModule } from 'ngx-bootstrap/modal';

// Routes
import { AppRoutingModule } from "./app-routing.module";

// App Config
import { AppConfig, AppConfigData } from "config/config";

@NgModule({
  imports: [
		SharedModule,
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		AppRoutingModule,
		ModalModule.forRoot(),
		PapaParseModule // DEMO
	],
  declarations: [
		AppComponent,
		/* Demo specific components */ DemoHomeComponent, DemoConfigComponent, DemoViewComponent,
		/* VIEWS */ EventDetailComponent,
		/* VIZ */ ExpenditureVizComponent, IncomeVizComponent		
	],
	providers: [
		/* Angular Services */ Title,
		/* Custom Demo Services */ DemoDataService, { provide: DataService, useClass: DemoDataService }, { provide: CodelistService, useClass: DemoCodelistService }, ToastService,
		/* Config Providers */ { provide: AppConfig, useValue: AppConfigData }
	],
  bootstrap: [ AppComponent ]
})
export class AppModule { }