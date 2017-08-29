import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule, Http, RequestOptions }     from '@angular/http';

import { SharedModule } from './shared.module';

import { AppComponent }  from './embed.component';

// Views components
import { EmbedLargeComponent } 		from './views/embed-large/embed-large.component';
// Data viz components

// Services
import { DataService } 		from './services/data.service';

// Routes
import { routing } from './embed.routing';

@NgModule({
  imports: [
		SharedModule,
		BrowserModule,
		BrowserAnimationsModule,
		HttpModule,
		routing
	],
  declarations: [
		AppComponent,
		/* Views */ EmbedLargeComponent,
	],
	providers: [
		DataService
	],
  bootstrap: [ AppComponent ]
})
export class AppModule { }