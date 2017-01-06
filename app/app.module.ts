import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http }     from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';

// Views components
import { FrontPageComponent }  from './views/front-page/front-page.component';
import { PageViewComponent }  from './views/page-view/page-view.component';
import { EntityListComponent } from './views/entity-list/entity-list.component';
import { EntityProfileComponent } from './views/entity-profile/entity-profile.component';
import { EntityAdminComponent } from "./views/entity-admin/entity-admin.component";

// Data viz components
import { DashboardComponent } from "./viz/dash-board/dash-board.component";
import { ExpenditureVizComponent } from './viz/expenditure-viz/expenditure-viz.component';
import { ExpenditureEventsComponent } from './viz/expenditure-events/expenditure-events.component';
import { ManagementReviewComponent } from "./viz/management-review/management-review.component";
import { DataSourcesComponent } from "./viz/data-sources/data-sources.component";
import { NoticeBoardComponent } from "./viz/notice-board/notice-board.component";
import { EventDetailComponent } from "./viz/event-detail/event-detail.component";

// Data viz components for data administration
import { DashboardAdminComponent } from "./viz/dash-board/dash-board-admin.component";
import { ExpenditureVizAdminComponent } from "./viz/expenditure-viz/expenditure-viz-admin.component";
import { NoticeBoardAdminComponent } from "./viz/notice-board/notice-board-admin.component";
import { EntityAdminModulesComponent } from "./views/entity-admin/entity-admin-modules.component";

// Services
import { DataService } 		from './services/data.service';
import { NoticeBoardService } 		from './services/notice-board.service';
import { ToastService } 		from './services/toast.service';
import { UserService } 		from './services/user.service';

// Import Modules
import { Ng2BootstrapModule, ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';

// Shared coremponents
import { ProfileMapComponent } 		from './shared/components/profile-map/profile-map.component';
import { ChartBigbangComponent } 		from './shared/components/chart-bigbang/chart-bigbang.component';
import { ChartDonutComponent } 		from './shared/components/chart-donut/chart-donut.component';

// Pipes
import { MoneyPipe } from './shared/pipes/money.pipe';

// Routes
import { routing } from './app.routing';

// Providers
import { AuthHttp, AuthConfig } from 'angular2-jwt';
export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({}), http);
}

@NgModule({
  imports: [
		BrowserModule,
		HttpModule,
		FormsModule,
		routing,
		Ng2BootstrapModule,
		FileUploadModule
	],
  declarations: [
		AppComponent,
		/* VIEWS */ FrontPageComponent, EntityListComponent, EntityProfileComponent, PageViewComponent, EntityAdminComponent,
		/* VIZ */ ExpenditureVizComponent, ExpenditureEventsComponent, ManagementReviewComponent, DashboardComponent, DataSourcesComponent, NoticeBoardComponent, EventDetailComponent, 
		/* VIZ ADMIN */ DashboardAdminComponent, ExpenditureVizAdminComponent, NoticeBoardAdminComponent, EntityAdminModulesComponent,
		/* Shared Components */ ProfileMapComponent, ChartBigbangComponent, ChartDonutComponent, 
		/* PIPES */ MoneyPipe
	],
	providers: [
		DataService, NoticeBoardService, ToastService, UserService, {provide: ComponentsHelper, useClass: ComponentsHelper},
		{
			provide: AuthHttp,
			useFactory: getAuthHttp,
			deps: [Http]
		}],
  bootstrap: [ AppComponent ]
})
export class AppModule { }