import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }     from '@angular/http';

import { AppComponent }  from './app.component';

// Views components
import { FrontPageComponent }  from './views/front-page/front-page.component';
import { PageViewComponent }  from './views/page-view/page-view.component';
import { EntityListComponent } from './views/entity-list/entity-list.component';

// Child modules
import { CoreModule } from './shared/core.module';
import { EntityViewModule } from './views/entity-view/entity-view.module';

// Pipes
import { MoneyPipe } from './pipes/money.pipe';

// Routes
import { routing } from './app.routing';

@NgModule({
  imports: [
		BrowserModule,
		CoreModule,
		EntityViewModule,
		routing
	],
  declarations: [ AppComponent, FrontPageComponent, EntityListComponent, PageViewComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }