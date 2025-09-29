/* Main component */
import { AppComponent } from "./app/app.component";

/* Initialization */
import { enableProdMode, importProvidersFrom, inject, provideAppInitializer } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";

/* HTTP Interceptors */
import { httpInterceptorProviders } from "./app/http-interceptors";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

/* App Config */
import { environment } from "environments/environment";
import { ConfigService, configFactory } from "./config";

/* Third Party */
import { ModalModule } from "ngx-bootstrap/modal";
import { JwtModule } from "@auth0/angular-jwt";
import { TranslateModule } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { providePrimeNG } from "primeng/config";
import Lara from "@primeng/themes/lara";
import { provideRouter, withInMemoryScrolling } from "@angular/router";
import { AppRoutes } from "app/app.routes";


// Settings for JWT
export function tokenGetter(): string {
  return localStorage.getItem("id_token") || "";
}

const jwtOptions = {
  config: {
    tokenGetter: tokenGetter,
    whitelistedDomains: environment.jwtDomains,
    throwNoTokenError: false,
    skipWhenExpired: true,
  },
};

if (environment.production) {
  enableProdMode();
}

console.log(`Running CityVizor built for ${environment.name} environment.`);

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, ModalModule.forRoot(), JwtModule.forRoot(jwtOptions), TranslateModule.forRoot({
            fallbackLang: "cs",
            loader: provideTranslateHttpLoader({
                prefix: "./assets/text/",
                suffix: ".json",
            }),
        })),
        provideAppInitializer(() => {
        const initializerFn = (configFactory)(inject(ConfigService));
        return initializerFn();
      }),
        httpInterceptorProviders,
        provideHttpClient(withInterceptorsFromDi()),
        providePrimeNG({
            theme: {
                preset: Lara
            }
        }),
        provideAnimations(),
        provideRouter(AppRoutes, withInMemoryScrolling({ scrollPositionRestoration: "enabled" }) ),
    ]
});
