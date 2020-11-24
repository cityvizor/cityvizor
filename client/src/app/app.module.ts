import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

/* MAIN COMPONENT */
import { AppComponent } from './app.component';

/* MODULES */
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { FrontpageModule } from './views/frontpage/frontpage.module';

/* HTTP Interceptors */
import { httpInterceptorProviders } from './http-interceptors';

/* App Config */
import { environment } from 'environments/environment';
import { AppConfig, AppConfigData } from "../config/config";


/* Third Party */
import { ModalModule } from 'ngx-bootstrap/modal';
import { JwtModule } from '@auth0/angular-jwt';



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
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		
		AppRoutingModule,
		
		SharedModule,
		FrontpageModule,

		ModalModule.forRoot(),
		JwtModule.forRoot(jwtOptions)
	],
	declarations: [
		AppComponent		
	],
	entryComponents: [
	],
	providers: [		
		/* Config Provider */ { provide: AppConfig, useValue: AppConfigData },
		httpInterceptorProviders
	],
	bootstrap: [AppComponent]
})
export class AppModule { }