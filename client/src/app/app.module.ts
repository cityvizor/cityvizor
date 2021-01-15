import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

/* MAIN COMPONENT */
import { AppComponent } from './app.component';

/* MODULES */
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { NotFoundPageModule } from './views/not-found-page/not-found-page.module';
import { LoginModule } from './views/login/login.module';

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
		LoginModule,
		NotFoundPageModule,

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