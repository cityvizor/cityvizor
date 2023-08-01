import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ExpenditureVizComponent } from './expenditure-viz/expenditure-viz.component';
import { IncomeVizComponent } from './income-viz/income-viz.component';
import { ConfigComponent } from './config/config.component';
import { ImportComponent } from './import/import.component';

const routes: Routes = [
  {
    path: "", component: ProfileComponent,
    children: [
      { path: "vydaje", component: ExpenditureVizComponent },
      { path: "prijmy", component: IncomeVizComponent },
      { path: "nastaveni", component: ConfigComponent },
      { path: "import", component: ImportComponent },

      { path: "", redirectTo: "import", pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
