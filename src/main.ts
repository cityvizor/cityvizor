import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from '@angular/core';

import { AppModule } from "app/app.module";
import { environment } from 'environments/environment';

if (environment.production) {
  enableProdMode();
}

console.log(`Running version built for ${environment.name} environment.`)

platformBrowserDynamic().bootstrapModule(AppModule);