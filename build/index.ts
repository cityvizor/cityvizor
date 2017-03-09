import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from './src/app.module.ngfactory';

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);