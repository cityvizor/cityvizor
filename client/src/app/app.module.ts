import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from 'app/shared/shared.module';

import { AppComponent } from './app.component';

// Views components
import { FrontPageComponent } from 'app/views/front-page/front-page.component';
import { ProfileAdminComponent } from "app/views/profile-admin/profile-admin.component";
import { SiteAdminComponent } from "app/views/site-admin/site-admin.component";
import { UserAdminComponent } from "app/views/user-admin/user-admin.component";

// Front page components
import { ProfileSearchComponent } from "app/views/front-page/profile-search/profile-search.component";
import { CounterpartySearchComponent } from "app/views/front-page/counterparty-search/counterparty-search.component";


// Data viz components for data administration
import { ProfileAdminProfileComponent } from "app/views/profile-admin/profile-admin-profile/profile-admin-profile.component";
import { ProfileAdminAvatarComponent } from "app/views/profile-admin/profile-admin-avatar/profile-admin-avatar.component";
import { ProfileAdminImportComponent } from "app/views/profile-admin/profile-admin-import/profile-admin-import.component";
import { ProfileAdminUsersComponent } from "app/views/profile-admin/profile-admin-users/profile-admin-users.component";

// Site administration components
import { SiteAdminProfilesComponent } from "app/views/site-admin/site-admin-profiles/site-admin-profiles.component";
import { SiteAdminProfileComponent } from "app/views/site-admin/site-admin-profile/site-admin-profile.component";
import { SiteAdminUsersComponent } from "app/views/site-admin/site-admin-users/site-admin-users.component";
import { SiteAdminUserComponent } from "app/views/site-admin/site-admin-user/site-admin-user.component";

// User Admin Components
import { UserAdminAccountComponent } from "app/views/user-admin/user-admin-account/user-admin-account.component";

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

// Routes
import { routing } from './app-routing.module';

// HTTP Interceptors
import { httpInterceptorProviders } from './http-interceptors';

// App Config
import { environment } from 'environments/environment';
import { AppConfig, AppConfigData } from "../config/config";


// settings for JWT
export function tokenGetter(): string {
	return localStorage.getItem('id_token') || "";
}

var jwtOptions = {
	config: {
		tokenGetter: tokenGetter,
		whitelistedDomains: environment.jwtDomains,
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
		/* VIEWS */ FrontPageComponent, ProfileAdminComponent, SiteAdminComponent, UserAdminComponent,
		/* FRONT PAGE */ ProfileSearchComponent, CounterpartySearchComponent,
		/* VIZ ADMIN */ ProfileAdminAvatarComponent, ProfileAdminProfileComponent, ProfileAdminImportComponent, ProfileAdminUsersComponent,
		/* ADMIN */ SiteAdminProfilesComponent, SiteAdminProfileComponent, SiteAdminUsersComponent, SiteAdminUserComponent,
		/* Service Desk */ UserAdminAccountComponent,
	],
	entryComponents: [
	],
	providers: [
		/* Angular Services */ Title,
		/* Custom Services */ DataService, CodelistService, ToastService, AuthService, ACLService,
		/* Config Providers */ { provide: AppConfig, useValue: AppConfigData },
		httpInterceptorProviders
	],
	bootstrap: [AppComponent]
})
export class AppModule { }