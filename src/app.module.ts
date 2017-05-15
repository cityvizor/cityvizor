import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule, Http }     from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';

// Views components
import { FrontPageComponent }  from './views/front-page/front-page.component';
import { PageViewComponent }  from './views/page-view/page-view.component';
import { ProfileListComponent } from './views/profile-list/profile-list.component';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';
import { ProfileAdminComponent } from "./views/profile-admin/profile-admin.component";
import { SiteAdminComponent } from "./views/site-admin/site-admin.component";
import { ServiceDeskComponent } from "./views/service-desk/service-desk.component";

// Data viz components
import { DashboardComponent } from "./viz/dash-board/dash-board.component";
import { ExpenditureVizComponent } from './viz/expenditure-viz/expenditure-viz.component';
import { ExpenditureEventsComponent } from './viz/expenditure-events/expenditure-events.component';
import { IncomeVizComponent } from './viz/income-viz/income-viz.component';
import { ContractListComponent } from "./viz/contract-list/contract-list.component";
import { NoticeBoardComponent } from "./viz/notice-board/notice-board.component";
import { EventDetailComponent } from "./viz/event-detail/event-detail.component";
import { DataCatalogueComponent } from "./viz/data-catalogue/data-catalogue.component";

// Data viz components for data administration
import { ProfileAdminProfileComponent } from "./views/profile-admin/profile-admin-profile/profile-admin-profile.component";
import { ProfileAdminModulesComponent } from "./views/profile-admin/profile-admin-modules/profile-admin-modules.component";
import { ProfileAdminImportComponent } from "./views/profile-admin/profile-admin-import/profile-admin-import.component";
import { ProfileAdminUsersComponent } from "./views/profile-admin/profile-admin-users/profile-admin-users.component";

// Site administration components
import { SiteAdminProfilesComponent } from "./views/site-admin/site-admin-profiles/site-admin-profiles.component";
import { SiteAdminProfileComponent } from "./views/site-admin/site-admin-profile/site-admin-profile.component";
import { SiteAdminUsersComponent } from "./views/site-admin/site-admin-users/site-admin-users.component";
import { SiteAdminUserComponent } from "./views/site-admin/site-admin-user/site-admin-user.component";
import { SiteAdminEntitiesComponent } from "./views/site-admin/site-admin-entities/site-admin-entities.component";
import { SiteAdminEntityComponent } from "./views/site-admin/site-admin-entity/site-admin-entity.component";

// Service Desk Components
import { ServiceDeskAccountComponent } from "./views/service-desk//service-desk-account/service-desk-account.component";

// Services
import { DataService } 		from './services/data.service';
import { YQLService } 		from './services/yql.service';
import { NoticeBoardService } 		from './services/notice-board.service';
import { ToastService } 		from './services/toast.service';
import { UserService } 		from './services/user.service';

// Import Modules
import { ModalModule, CollapseModule } from 'ngx-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';

// Shared coremponents
import { HeaderMenuComponent } 		from './shared/components/header-menu/header-menu.component';
import { ProfileHeaderComponent } 		from './shared/components/profile-header/profile-header.component';
import { ProfileMapComponent } 		from './shared/components/profile-map/profile-map.component';
import { ChartBigbangComponent } 		from './shared/components/chart-bigbang/chart-bigbang.component';
import { ChartDonutComponent } 		from './shared/components/chart-donut/chart-donut.component';

// Pipes
import { MoneyPipe } from './shared/pipes/money.pipe';
import { AddressPipe, PostalCodePipe } from './shared/pipes/address.pipe';
import { ConcatPipe, ArrayChildrenPipe, ArrayPipe } from './shared/pipes/utils.pipe';

// Routes
import { routing } from './app.routing';

// Providers
import { AuthHttp, AuthConfig } from 'angular2-jwt';
export function getAuthHttp(http) {
	var options = {
		noJwtError:true
	};
  return new AuthHttp(new AuthConfig(options), http);
}

@NgModule({
  imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpModule,
		FormsModule,
		routing,
		ModalModule.forRoot(), CollapseModule.forRoot(),
		FileUploadModule
	],
  declarations: [
		AppComponent,
		/* VIEWS */ FrontPageComponent, ProfileListComponent, ProfileViewComponent, ProfileAdminComponent, PageViewComponent, SiteAdminComponent, ServiceDeskComponent,
		/* VIZ */ ExpenditureVizComponent, ExpenditureEventsComponent, IncomeVizComponent, ContractListComponent, DashboardComponent, NoticeBoardComponent, EventDetailComponent, DataCatalogueComponent,
		/* VIZ ADMIN */ ProfileAdminProfileComponent, ProfileAdminModulesComponent, ProfileAdminImportComponent, ProfileAdminUsersComponent,
		/* ADMIN */ SiteAdminProfilesComponent, SiteAdminProfileComponent, SiteAdminUsersComponent, SiteAdminUserComponent, SiteAdminEntitiesComponent, SiteAdminEntityComponent,
		/* Service Desk */ ServiceDeskAccountComponent,
		/* Shared Components */ HeaderMenuComponent, ProfileHeaderComponent, ProfileMapComponent, ChartBigbangComponent, ChartDonutComponent, 
		/* PIPES */ MoneyPipe, ConcatPipe, ArrayChildrenPipe, AddressPipe, PostalCodePipe, ArrayPipe
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