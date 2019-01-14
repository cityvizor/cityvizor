import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from 'app/shared/shared.module';

import { AppComponent } from './app.component';

// Views components
import { FrontPageComponent } from 'app/views/front-page/front-page.component';
import { ProfileViewComponent } from 'app/views/profile-view/profile-view.component';
import { ProfileAdminComponent } from "app/views/profile-admin/profile-admin.component";
import { SiteAdminComponent } from "app/views/site-admin/site-admin.component";
import { UserAdminComponent } from "app/views/user-admin/user-admin.component";
import { EventDetailComponent } from "app/views/event-detail/event-detail.component";
import { CounterpartyViewComponent } from "app/views/counterparty-view/counterparty-view.component";

// Front page components
import { ProfileSearchComponent } from "app/views/front-page/profile-search/profile-search.component";
import { CounterpartySearchComponent } from "app/views/front-page/counterparty-search/counterparty-search.component";


// Couterparty components
import { CounterpartyViewProfilesComponent } from "app/views/counterparty-view/counterparty-view-profiles/counterparty-view-profiles.component";
import { CounterpartyViewPaymentsComponent } from "app/views/counterparty-view/counterparty-view-payments/counterparty-view-payments.component";

// Data viz components
import { DashboardComponent } from "app/views/profile-view/dash-board/dash-board.component";
import { BigBangVizComponent } from 'app/views/profile-view/bigbang-viz/bigbang-viz.component';
import { InvoiceListComponent } from 'app/views/profile-view/invoice-list/invoice-list.component';
import { NoticeBoardComponent } from "app/views/profile-view/notice-board/notice-board.component";
import { ContractListComponent } from "app/views/profile-view/contract-list/contract-list.component";
import { DataSourcesComponent } from "app/views/profile-view/data-sources/data-sources.component";

// Data viz components for data administration
import { ProfileAdminProfileComponent } from "app/views/profile-admin/profile-admin-profile/profile-admin-profile.component";
import { ProfileAdminAvatarComponent } from "app/views/profile-admin/profile-admin-avatar/profile-admin-avatar.component";
import { ProfileAdminModulesComponent } from "app/views/profile-admin/profile-admin-modules/profile-admin-modules.component";
import { ProfileAdminImportComponent } from "app/views/profile-admin/profile-admin-import/profile-admin-import.component";
import { ProfileAdminUsersComponent } from "app/views/profile-admin/profile-admin-users/profile-admin-users.component";

// Site administration components
import { SiteAdminProfilesComponent } from "app/views/site-admin/site-admin-profiles/site-admin-profiles.component";
import { SiteAdminProfileComponent } from "app/views/site-admin/site-admin-profile/site-admin-profile.component";
import { SiteAdminUsersComponent } from "app/views/site-admin/site-admin-users/site-admin-users.component";
import { SiteAdminUserComponent } from "app/views/site-admin/site-admin-user/site-admin-user.component";

// User Admin Components
import { UserAdminAccountComponent } from "app/views/user-admin/user-admin-account/user-admin-account.component";

// EasterEggEqualiser Component
import { EasterEggEqualiserComponent } from 'app/shared/components/easteregg-equaliser/easteregg-equaliser.component';

// Services
import { DataService } from 'app/services/data.service';
import { CodelistService } from 'app/services/codelist.service';
import { ToastService } from 'app/services/toast.service';
import { AuthService } from 'app/services/auth.service';
import { ACLService } from "app/services/acl.service";

// Import Modules
import { ModalModule } from 'ngx-bootstrap/modal';
import { FileUploadModule } from 'ng2-file-upload';
import { JwtModule } from '@auth0/angular-jwt';

// Shared coremponents
import { LoginFormComponent } from 'app/shared/components/login-form/login-form.component';
import { HeaderMenuComponent } from 'app/shared/components/header-menu/header-menu.component';
import { ProfileHeaderComponent } from 'app/shared/components/profile-header/profile-header.component';

// Routes
import { routing } from './app-routing.module';

// App Config
import { AppConfig, AppConfigData } from "../config/config";

// settings for JWT
export function tokenGetter(): string {
	return localStorage.getItem('id_token') || "";
}

var jwtOptions = {
	config: {
		tokenGetter: tokenGetter,
		whitelistedDomains: ['cityvizor.cz','dev.cityvizor.cz'],
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
		/* FRONT PAGE */ ProfileSearchComponent, CounterpartySearchComponent,
    	/* COUNTERPSRTY */ CounterpartyViewProfilesComponent, CounterpartyViewPaymentsComponent,
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
	bootstrap: [AppComponent]
})
export class AppModule { }