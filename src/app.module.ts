import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule, Http, RequestOptions }     from '@angular/http';
import { FormsModule } from '@angular/forms';

import { SharedModule } from './shared.module';

import { AppComponent }  from './app.component';

// Views components
import { FrontPageComponent }  from './views/front-page/front-page.component';
import { ProfileListComponent } from './views/profile-list/profile-list.component';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';
import { ProfileAdminComponent } from "./views/profile-admin/profile-admin.component";
import { SiteAdminComponent } from "./views/site-admin/site-admin.component";
import { UserAdminComponent } from "./views/user-admin/user-admin.component";

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
import { ProfileAdminImportBoxComponent } from "./views/profile-admin/profile-admin-import-box/profile-admin-import-box.component";
import { ProfileAdminUsersComponent } from "./views/profile-admin/profile-admin-users/profile-admin-users.component";

// Site administration components
import { SiteAdminProfilesComponent } from "./views/site-admin/site-admin-profiles/site-admin-profiles.component";
import { SiteAdminProfileComponent } from "./views/site-admin/site-admin-profile/site-admin-profile.component";
import { SiteAdminUsersComponent } from "./views/site-admin/site-admin-users/site-admin-users.component";
import { SiteAdminUserComponent } from "./views/site-admin/site-admin-user/site-admin-user.component";
import { SiteAdminEntitiesComponent } from "./views/site-admin/site-admin-entities/site-admin-entities.component";
import { SiteAdminEntityComponent } from "./views/site-admin/site-admin-entity/site-admin-entity.component";

// User Admin Components
import { UserAdminAccountComponent } from "./views/user-admin/user-admin-account/user-admin-account.component";

// Services
import { DataService } 		from './services/data.service';
import { YQLService } 		from './services/yql.service';
import { ToastService } 		from './services/toast.service';
import { AuthService } 		from './services/auth.service';

// Import Modules
import { ModalModule, CollapseModule, BsDropdownModule } from 'ngx-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';

// Shared coremponents
import { HeaderMenuComponent } 		from './shared/components/header-menu/header-menu.component';
import { ProfileHeaderComponent } 		from './shared/components/profile-header/profile-header.component';

// Routes
import { routing } from './app.routing';

// Providers
import { AuthHttp, AuthConfig } from 'angular2-jwt';
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  var jwtOptions = {
		tokenName: "id_token",
		noJwtError:true
	};
	return new AuthHttp(new AuthConfig(jwtOptions), http, options);
}

@NgModule({
  imports: [
		SharedModule,
		BrowserModule,
		BrowserAnimationsModule,
		HttpModule,
		FormsModule,
		routing,
		ModalModule.forRoot(), CollapseModule.forRoot(), BsDropdownModule.forRoot(),
		FileUploadModule
	],
  declarations: [
		AppComponent,
		/* VIEWS */ FrontPageComponent, ProfileListComponent, ProfileViewComponent, ProfileAdminComponent, SiteAdminComponent, UserAdminComponent,
		/* VIZ */ ExpenditureVizComponent, ExpenditureEventsComponent, IncomeVizComponent, ContractListComponent, DashboardComponent, NoticeBoardComponent, EventDetailComponent, DataCatalogueComponent,
		/* VIZ ADMIN */ ProfileAdminProfileComponent, ProfileAdminModulesComponent, ProfileAdminImportComponent, ProfileAdminImportBoxComponent, ProfileAdminUsersComponent,
		/* ADMIN */ SiteAdminProfilesComponent, SiteAdminProfileComponent, SiteAdminUsersComponent, SiteAdminUserComponent, SiteAdminEntitiesComponent, SiteAdminEntityComponent,
		/* Service Desk */ UserAdminAccountComponent,
		/* Shared Components */ HeaderMenuComponent, ProfileHeaderComponent,
		
	],
	providers: [
		DataService, YQLService, ToastService, AuthService,
		{
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
	],
  bootstrap: [ AppComponent ]
})
export class AppModule { }