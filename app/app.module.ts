import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }     from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';

// Views components
import { FrontPageComponent }  from './views/front-page/front-page.component';
import { PageViewComponent }  from './views/page-view/page-view.component';
import { EntityListComponent } from './views/entity-list/entity-list.component';
import { EntityViewComponent } from './views/entity-view/entity-view.component';
import { EntityAdminComponent } from "./views/entity-admin/entity-admin.component";

// Data viz componentsimport { EntityViewComponent } from './entity-view.component';
import { EntityInfoComponent } from "./dataviz/entity-info/entity-info.component";
import { ExpenditureViewComponent } from './dataviz/expenditure-view/expenditure-view.component';
import { ExpenditureListComponent } from './dataviz/expenditure-view/expenditure-list/expenditure-list.component';
import { ExpenditureVizComponent } from './dataviz/expenditure-view/expenditure-viz/expenditure-viz.component';
import { ManagementReviewComponent } from "./dataviz/management-review/management-review.component";
import { DataSourcesComponent } from "./dataviz/data-sources/data-sources.component";
import { NoticeBoardComponent } from "./dataviz/notice-board/notice-board.component";

// Services
import { DataService } 		from './services/data.service';
import { NoticeBoardService } 		from './services/notice-board.service';
import { ToastService } 		from './services/toast.service';

// Pipes
import { MoneyPipe } from './pipes/money.pipe';

// Routes
import { routing } from './app.routing';

@NgModule({
  imports: [
		BrowserModule,
		HttpModule,
		FormsModule,
		routing
	],
  declarations: [
		AppComponent,
		/* VIEWS */ FrontPageComponent, EntityListComponent, EntityViewComponent, PageViewComponent, EntityAdminComponent,
		/* DATAVIZ */ ExpenditureViewComponent, ExpenditureListComponent, ExpenditureVizComponent, ManagementReviewComponent, EntityInfoComponent, DataSourcesComponent, NoticeBoardComponent,
		/* PIPES */ MoneyPipe
	],
	providers: [ DataService, NoticeBoardService, ToastService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }