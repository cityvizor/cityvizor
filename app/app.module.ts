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
import { DashboardComponent } from "./viz/dash-board/dash-board.component";
import { ExpenditureViewComponent } from './viz/expenditure-view/expenditure-view.component';
import { ExpenditureListComponent } from './viz/expenditure-view/expenditure-list/expenditure-list.component';
import { ExpenditureVizComponent } from './viz/expenditure-view/expenditure-viz/expenditure-viz.component';
import { ManagementReviewComponent } from "./viz/management-review/management-review.component";
import { DataSourcesComponent } from "./viz/data-sources/data-sources.component";
import { NoticeBoardComponent } from "./viz/notice-board/notice-board.component";

// Data viz components for data administration
import { DashboardAdminComponent } from "./viz/dash-board/dash-board-admin.component";
import { NoticeBoardAdminComponent } from "./viz/notice-board/notice-board-admin.component";
import { EntityAdminModulesComponent } from "./views/entity-admin/entity-admin-modules.component";

// Services
import { DataService } 		from './services/data.service';
import { NoticeBoardService } 		from './services/notice-board.service';
import { ToastService } 		from './services/toast.service';

//Bootstrap
import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';

// Directives
import { ng2MapyCZ } from './directives/ng2mapy/mapy-cz.directive';
// Pipes
import { MoneyPipe } from './pipes/money.pipe';

// Routes
import { routing } from './app.routing';

@NgModule({
  imports: [
		BrowserModule,
		HttpModule,
		FormsModule,
		routing,
		/*bs*/ ModalModule
	],
  declarations: [
		AppComponent,
		/* VIEWS */ FrontPageComponent, EntityListComponent, EntityViewComponent, PageViewComponent, EntityAdminComponent,
		/* VIZ */ ExpenditureViewComponent, ExpenditureListComponent, ExpenditureVizComponent, ManagementReviewComponent, DashboardComponent, DataSourcesComponent, NoticeBoardComponent,
		/* VIZ ADMIN */ DashboardAdminComponent, NoticeBoardAdminComponent, EntityAdminModulesComponent,
		/* DIRECTIVES */ ng2MapyCZ,
		/* PIPES */ MoneyPipe
	],
	providers: [ DataService, NoticeBoardService, ToastService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }