/* Main component */
import { AppComponent } from "./app/app.component";

/* Initialization */
import {
  enableProdMode,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";

/* HTTP Interceptors */
import { httpInterceptorProviders } from "./app/http-interceptors";
import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from "@angular/common/http";

/* App Config */
import { environment } from "environments/environment";
import { ConfigService, configFactory } from "./config";

/* Third Party */
import { JwtModule } from "@auth0/angular-jwt";
import { TranslateModule } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { provideRouter, withInMemoryScrolling } from "@angular/router";
import { AppRoutes } from "app/app.routes";
import { FeatureFlagsService } from "app/services/feature-flags.service";

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
    provideZonelessChangeDetection(),
    importProvidersFrom(
      BrowserModule,
      JwtModule.forRoot(jwtOptions),
      TranslateModule.forRoot({
        fallbackLang: "cs",
        loader: provideTranslateHttpLoader({
          prefix: "./assets/text/",
          suffix: ".json",
        }),
      }),
    ),
    provideAppInitializer(() => {
      const initializerFn = configFactory(inject(ConfigService));
      return initializerFn();
    }),
    provideAppInitializer(() => inject(FeatureFlagsService).load()),
    httpInterceptorProviders,
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    provideAnimations(),
    provideRouter(
      AppRoutes,
      withInMemoryScrolling({ scrollPositionRestoration: "enabled" }),
    ),
  ],
});
