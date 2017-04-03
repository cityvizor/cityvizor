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
import { ContractListComponent } from "./viz/contract-list/contract-list.component";
import { NoticeBoardComponent } from "./viz/notice-board/notice-board.component";
import { EventDetailComponent } from "./viz/event-detail/event-detail.component";
import { DataCatalogueComponent } from "./viz/data-catalogue/data-catalogue.component";

// Data viz components for data administration
import { EntityAdminProfileComponent } from "./views/entity-admin/entity-admin-profile/entity-admin-profile.component";
import { EntityAdminModulesComponent } from "./views/entity-admin/entity-admin-modules/entity-admin-modules.component";
import { EntityAdminImportComponent } from "./views/entity-admin/entity-admin-import/entity-admin-import.component";
import { EntityAdminUsersComponent } from "./views/entity-admin/entity-admin-users/entity-admin-users.component";

// Services
import { DataService } 		from './services/data.service';
import { YQLService } 		from './services/yql.service';
import { NoticeBoardService } 		from './services/notice-board.service';
import { ToastService } 		from './services/toast.service';
import { UserService } 		from './services/user.service';

// Import Modules
import { ModalModule, CollapseModule } from 'ng2-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';

// Shared coremponents
import { ProfileHeaderComponent } 		from './shared/components/profile-header/profile-header.component';
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
		ModalModule.forRoot(), CollapseModule.forRoot(),
		FileUploadModule
	],
  declarations: [
		AppComponent,
		/* VIEWS */ FrontPageComponent, EntityListComponent, EntityProfileComponent, PageViewComponent, EntityAdminComponent,
		/* VIZ */ ExpenditureVizComponent, ExpenditureEventsComponent, ContractListComponent, DashboardComponent, NoticeBoardComponent, EventDetailComponent, DataCatalogueComponent,
		/* VIZ ADMIN */ EntityAdminProfileComponent, EntityAdminModulesComponent, EntityAdminImportComponent, EntityAdminUsersComponent,
		/* Shared Components */ ProfileHeaderComponent, ProfileMapComponent, ChartBigbangComponent, ChartDonutComponent, 
		/* PIPES */ MoneyPipe
	],
	providers: [
		DataService, YQLService, NoticeBoardService, ToastService, UserService,
		{
			provide: AuthHttp,
			useFactory: getAuthHttp,
			deps: [Http]
		}],
  bootstrap: [ AppComponent ]
})
export class AppModule { }