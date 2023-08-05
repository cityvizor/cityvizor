import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
import { ConfigService, configFactory } from "../config";


/* Third Party */
import { ModalModule } from 'ngx-bootstrap/modal';
import { JwtModule } from '@auth0/angular-jwt';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// settings for JWT
export function tokenGetter(): string {
	return localStorage.getItem('id_token') || "";
}

const jwtOptions = {
	config: {
		tokenGetter: tokenGetter,
		whitelistedDomains: environment.jwtDomains,
		throwNoTokenError: false,
		skipWhenExpired: true
	}
};

export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/text/', '.json');
}

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
        JwtModule.forRoot(jwtOptions),
        TranslateModule.forRoot({
            defaultLanguage: 'cs',
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            }
        }),
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: configFactory,
            deps: [ConfigService],
            multi: true
        },
        httpInterceptorProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }