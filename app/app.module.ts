import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }     from '@angular/http';

import { AppComponent }  from './app.component';

// Views components
import { FrontPageComponent }  from './views/front-page/front-page.component';
import { PageViewComponent }  from './views/page-view/page-view.component';
import { EntityListComponent } from './views/entity-list/entity-list.component';
import { EntityViewComponent } from './views/entity-view/entity-view.component';

// Data viz componentsimport { EntityViewComponent } from './entity-view.component';
import { EntityInfoComponent } from "./dataviz/entity-info/entity-info.component";
import { ExpenditureViewComponent } from './dataviz/expenditure-view/expenditure-view.component';
import { ExpenditureListComponent } from './dataviz/expenditure-view/expenditure-list/expenditure-list.component';
import { ExpenditureVizComponent } from './dataviz/expenditure-view/expenditure-viz/expenditure-viz.component';
import { ManagementReviewComponent } from "./dataviz/management-review/management-review.component";
import { DataSourcesComponent } from "./dataviz/data-sources/data-sources.component";
import { NoticeBoardComponent } from "./dataviz/notice-board/notice-board.component";

// Child modules
//import { CoreModule } from './shared/core.module';
//import { EntityViewModule } from './views/entity-view/entity-view.module';

// Services
import { DataService } 		from './services/data.service';
import { NoticeBoardService } 		from './services/notice-board.service';

// Pipes
import { MoneyPipe } from './pipes/money.pipe';

// Routes
import { routing } from './app.routing';

@NgModule({
  imports: [
		BrowserModule,
		//CoreModule,
		HttpModule,
		//EntityViewModule,
		routing
	],
  declarations: [
		AppComponent,
		/* VIEWS */ FrontPageComponent, EntityListComponent, EntityViewComponent, PageViewComponent,
		/* DATAVIZ */ ExpenditureViewComponent, ExpenditureListComponent, ExpenditureVizComponent, ManagementReviewComponent, EntityInfoComponent, DataSourcesComponent, NoticeBoardComponent,
		/* PIPES */ MoneyPipe
	],
	providers: [ DataService, NoticeBoardService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }