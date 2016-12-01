import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }     from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';

// Views components
import { FrontPageComponent }  from './views/front-page/front-page.component';
import { PageViewComponent }  from './views/page-view/page-view.component';
import { EntityListComponent } from './views/entity-list/entity-list.component';
import { EntityProfileComponent } from './views/entity-profile/entity-profile.component';
import { EntityAdminComponent } from "./views/entity-admin/entity-admin.component";

// Data viz components
import { DashboardComponent } from "./viz/dash-board/dash-board.component";
import { ExpenditureViewComponent } from './viz/expenditure-view/expenditure-view.component';
import { ExpenditureListComponent } from './viz/expenditure-view/expenditure-list/expenditure-list.component';
import { ExpenditureVizComponent } from './viz/expenditure-view/expenditure-viz/expenditure-viz.component';
import { ManagementReviewComponent } from "./viz/management-review/management-review.component";
import { DataSourcesComponent } from "./viz/data-sources/data-sources.component";
import { NoticeBoardComponent } from "./viz/notice-board/notice-board.component";

// Data viz components for data administration
import { DashboardAdminComponent } from "./viz/dash-board/dash-board-admin.component";
import { ExpenditureViewAdminComponent } from "./viz/expenditure-view/expenditure-view-admin.component";
import { NoticeBoardAdminComponent } from "./viz/notice-board/notice-board-admin.component";
import { EntityAdminModulesComponent } from "./views/entity-admin/entity-admin-modules.component";



// Services
import { DataService } 		from './services/data.service';
import { NoticeBoardService } 		from './services/notice-board.service';
import { ToastService } 		from './services/toast.service';
import { UserService } 		from './services/user.service';

// Import Modules
import { Ng2BootstrapModule, ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
// Directives

// Pipes
import { MoneyPipe } from './pipes/money.pipe';

// Routes
import { routing } from './app.routing';

@NgModule({
  imports: [
		BrowserModule,
		HttpModule,
		FormsModule,
		routing,
		Ng2BootstrapModule,
		FileUploadModule
	],
  declarations: [
		AppComponent,
		/* VIEWS */ FrontPageComponent, EntityListComponent, EntityProfileComponent, PageViewComponent, EntityAdminComponent,
		/* VIZ */ ExpenditureViewComponent, ExpenditureListComponent, ExpenditureVizComponent, ManagementReviewComponent, DashboardComponent, DataSourcesComponent, NoticeBoardComponent,
		/* VIZ ADMIN */ DashboardAdminComponent, ExpenditureViewAdminComponent, NoticeBoardAdminComponent, EntityAdminModulesComponent,
		/* DIRECTIVES */
		/* PIPES */ MoneyPipe
	],
	providers: [ DataService, NoticeBoardService, ToastService, UserService, {provide: ComponentsHelper, useClass: ComponentsHelper} ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }