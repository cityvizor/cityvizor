import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions  } from '@angular/router';

import { DemoViewComponent } from './views/demo-view/demo-view.component';
import { DemoHomeComponent } from './views/demo-home/demo-home.component';

const routes: Routes = [
	{path: '', component: DemoHomeComponent},
	
	{path: 'profil/:module', component: DemoViewComponent},
	{path: 'profil', redirectTo: 'profil/nastaveni', pathMatch: 'full'},
];

const extraOptions:ExtraOptions = {
  scrollPositionRestoration: "enabled",
  anchorScrolling: "enabled"
};

@NgModule({
  imports: [RouterModule.forRoot(routes, extraOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }