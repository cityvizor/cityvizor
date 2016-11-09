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

// Data viz components
import { EntityInfoComponent } from "./viz/entity-info/entity-info.component";
import { ExpenditureViewComponent } from './viz/expenditure-view/expenditure-view.component';
import { ExpenditureListComponent } from './viz/expenditure-view/expenditure-list/expenditure-list.component';
import { ExpenditureVizComponent } from './viz/expenditure-view/expenditure-viz/expenditure-viz.component';
import { ManagementReviewComponent } from "./viz/management-review/management-review.component";
import { DataSourcesComponent } from "./viz/data-sources/data-sources.component";
import { NoticeBoardComponent } from "./viz/notice-board/notice-board.component";

// Data viz components for data administration
import { EntityInfoAdminComponent } from "./viz/entity-info/entity-info-admin.component";
import { NoticeBoardAdminComponent } from "./viz/notice-board/notice-board-admin.component";
import { EntityAdminModulesComponent } from "./views/entity-admin/entity-admin-modules.component";

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
		/* VIZ */ ExpenditureViewComponent, ExpenditureListComponent, ExpenditureVizComponent, ManagementReviewComponent, EntityInfoComponent, DataSourcesComponent, NoticeBoardComponent,
		/* VIZ ADMIN */ EntityInfoAdminComponent, NoticeBoardAdminComponent, EntityAdminModulesComponent,
		/* PIPES */ MoneyPipe
	],
	providers: [ DataService, NoticeBoardService, ToastService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }