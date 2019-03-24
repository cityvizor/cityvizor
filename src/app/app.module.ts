import { NgModule }      from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from './shared/shared.module';

import { AppComponent }  from './app.component';

// Views components
import { HomeComponent }  from './views/home/home.component';

// Routes
import { AppRoutingModule } from "./app-routing.module";

// App Config
import { AppConfig, AppConfigData } from "config/config";


@NgModule({
  imports: [
		SharedModule,
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule		
	],
  declarations: [
		AppComponent,
		HomeComponent
	],
	providers: [		
		/* Config Providers */ { provide: AppConfig, useValue: AppConfigData }
	],
  bootstrap: [ AppComponent ]
})
export class AppModule { }