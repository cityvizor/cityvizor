import { NgModule }      from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from './module.shared';

import { AppComponent }  from './app.component';

// Views components
import { FrontPageComponent }  from './views/front-page/front-page.component';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';
import { ProfileAdminComponent } from "./views/profile-admin/profile-admin.component";
import { SiteAdminComponent } from "./views/site-admin/site-admin.component";
import { UserAdminComponent } from "./views/user-admin/user-admin.component";
import { EventDetailComponent } from "./views/event-detail/event-detail.component";
import { CounterpartyViewComponent } from "./views/counterparty-view/counterparty-view.component";

// Front page components
import { ProfileSearchComponent } from "./views/front-page/profile-search/profile-search.component";
import { CounterpartySearchComponent } from "./views/front-page/counterparty-search/counterparty-search.component";

// Data viz components
import { DashboardComponent } from "./views/profile-view/dash-board/dash-board.component";
import { BigBangVizComponent } from './views/profile-view/bigbang-viz/bigbang-viz.component';
import { InvoiceListComponent } from './views/profile-view/invoice-list/invoice-list.component';
import { NoticeBoardComponent } from "./views/profile-view/notice-board/notice-board.component";
import { ContractListComponent } from "./views/profile-view/contract-list/contract-list.component";
import { DataSourcesComponent } from "./views/profile-view/data-sources/data-sources.component";

// Data viz components for data administration
import { ProfileAdminProfileComponent } from "./views/profile-admin/profile-admin-profile/profile-admin-profile.component";
import { ProfileAdminAvatarComponent } from "./views/profile-admin/profile-admin-avatar/profile-admin-avatar.component";
import { ProfileAdminModulesComponent } from "./views/profile-admin/profile-admin-modules/profile-admin-modules.component";
import { ProfileAdminImportComponent } from "./views/profile-admin/profile-admin-import/profile-admin-import.component";
import { ProfileAdminUsersComponent } from "./views/profile-admin/profile-admin-users/profile-admin-users.component";

// Site administration components
import { SiteAdminProfilesComponent } from "./views/site-admin/site-admin-profiles/site-admin-profiles.component";
import { SiteAdminProfileComponent } from "./views/site-admin/site-admin-profile/site-admin-profile.component";
import { SiteAdminUsersComponent } from "./views/site-admin/site-admin-users/site-admin-users.component";
import { SiteAdminUserComponent } from "./views/site-admin/site-admin-user/site-admin-user.component";

// User Admin Components
import { UserAdminAccountComponent } from "./views/user-admin/user-admin-account/user-admin-account.component";

// EasterEggEqualiser Component
import { EasterEggEqualiserComponent } from './shared/components/easteregg-equaliser/easteregg-equaliser.component';

// Services
import { DataService } 		from './services/data.service';
import { CodelistService } 		from './services/codelist.service';
import { ToastService } 		from './services/toast.service';
import { AuthService } 		from './services/auth.service';
import { ACLService } from "./services/acl.service";

// Import Modules
import { ModalModule } from 'ngx-bootstrap/modal';
import { FileUploadModule } from 'ng2-file-upload';
import { JwtModule } from '@auth0/angular-jwt';

// Shared coremponents
import { LoginFormComponent } 		from './shared/components/login-form/login-form.component';
import { HeaderMenuComponent } 		from './shared/components/header-menu/header-menu.component';
import { ProfileHeaderComponent } 		from './shared/components/header-menu/profile-header.component';

// Routes
import { routing } from './routing';

// App Config
import { AppConfig, AppConfigData } from "./config/config";

// settings for JWT
export function tokenGetter():string{
	return localStorage.getItem('id_token') || "";
}

var jwtOptions = {
	config: {
		tokenGetter: tokenGetter,
		whitelistedDomains: ['cityvizor.cz'],
		throwNoTokenError: false,
		skipWhenExpired: true
	}
};

@NgModule({
  imports: [
		SharedModule,
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		routing,
		ModalModule.forRoot(),
		FileUploadModule,
		JwtModule.forRoot(jwtOptions)
	],
  declarations: [
		AppComponent,
		/* VIEWS */ FrontPageComponent, ProfileViewComponent, ProfileAdminComponent, SiteAdminComponent, UserAdminComponent, CounterpartyViewComponent,
		/* FRONT PAGE */ CounterpartySearchComponent, ProfileSearchComponent,
		/* VIZ */ BigBangVizComponent, InvoiceListComponent, ContractListComponent, DashboardComponent, NoticeBoardComponent, EventDetailComponent, DataSourcesComponent,
		/* VIZ ADMIN */ ProfileAdminAvatarComponent, ProfileAdminProfileComponent, ProfileAdminModulesComponent, ProfileAdminImportComponent, ProfileAdminUsersComponent,
		/* ADMIN */ SiteAdminProfilesComponent, SiteAdminProfileComponent, SiteAdminUsersComponent, SiteAdminUserComponent,
    /* Equaliser Component */ EasterEggEqualiserComponent,
		/* Service Desk */ UserAdminAccountComponent,
		/* Shared Components */ LoginFormComponent, HeaderMenuComponent, ProfileHeaderComponent,
	],
	entryComponents: [
	],
	providers: [
		/* Angular Services */ Title,
		/* Custom Services */ DataService, CodelistService, ToastService, AuthService, ACLService,
		/* Config Providers */ { provide: AppConfig, useValue: AppConfigData }
	],
  bootstrap: [ AppComponent ]
})
export class AppModule { }