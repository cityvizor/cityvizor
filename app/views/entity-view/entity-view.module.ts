import { NgModule }       from '@angular/core';

import { EntityViewComponent } from './entity-view.component';
import { EntityInfoComponent } from "../../dataviz/entity-info/entity-info.component";
import { ExpenditureViewComponent } from '../../dataviz/expenditure-view/expenditure-view.component';
import { ExpenditureListComponent } from '../../dataviz/expenditure-view/expenditure-list/expenditure-list.component';
import { ExpenditureVizComponent } from '../../dataviz/expenditure-view/expenditure-viz/expenditure-viz.component';
import { ManagementReviewComponent } from "../../dataviz/management-review/management-review.component";
import { DataSourcesComponent } from "../../dataviz/data-sources/data-sources.component";
import { NoticeBoardComponent } from "../../dataviz/notice-board/notice-board.component";

import { NoticeBoardService } 		from '../../services/notice-board.service';

import { entityViewRouting } from './entity-view.routing';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [ entityViewRouting, SharedModule ],
  declarations: [ EntityViewComponent, ExpenditureViewComponent, ExpenditureListComponent, ExpenditureVizComponent, ManagementReviewComponent, EntityInfoComponent, DataSourcesComponent, NoticeBoardComponent ],
	providers: [ NoticeBoardService ]
})
export class EntityViewModule { }