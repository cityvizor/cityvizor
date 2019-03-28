import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// MODULES
import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from 'app/shared/shared.module';

// VIEWS
import { EventDetailComponent } from "./event-detail/event-detail.component";
import { ImportComponent } from './import/import.component';
import { ConfigComponent }  from './config/config.component';

// VIZ
import { ExpenditureVizComponent } from './expenditure-viz/expenditure-viz.component';
import { IncomeVizComponent } from './income-viz/income-viz.component';
import { ProfileComponent } from './profile.component';


@NgModule({
  declarations: [
    ProfileComponent,
    ImportComponent,ConfigComponent,
    ExpenditureVizComponent, IncomeVizComponent, EventDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
