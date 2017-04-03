import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from './src/app.module.ngfactory';
import {enableProdMode} from '@angular/core';

enableProdMode();

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);