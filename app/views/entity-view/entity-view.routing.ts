import { ModuleWithProviders }   from '@angular/core';
import { Routes, RouterModule }  from '@angular/router';

import { EntityViewComponent } from "./entity-view.component";
import { EntityInfoComponent } from "../../dataviz/entity-info/entity-info.component";
import { ExpenditureViewComponent } from "../../dataviz/expenditure-view/expenditure-view.component";
import { ManagementReviewComponent } from "../../dataviz/management-review/management-review.component";
import { DataSourcesComponent } from "../../dataviz/data-sources/data-sources.component";
import { NoticeBoardComponent } from "../../dataviz/notice-board/notice-board.component";

const entityRoutes: Routes = [
  {
    path: 'ico/:id',
    component: EntityViewComponent,
    children: [
      { path: 'informace',  component: EntityInfoComponent },
			{ path: 'vydaje',  component: ExpenditureViewComponent },
			{ path: 'prezkum-hospodareni',  component: ManagementReviewComponent },
			{ path: 'uredni-deska',  component: NoticeBoardComponent },
			{ path: 'datove-zdroje',  component: DataSourcesComponent },
			{ path: '',  redirectTo: 'vydaje'}
    ]
  }
];

export const entityViewRouting: ModuleWithProviders = RouterModule.forChild(entityRoutes);