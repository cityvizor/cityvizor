import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions  } from '@angular/router';

import { HomeComponent } from './views/home/home.component';

const routes: Routes = [
	{path: '', component: HomeComponent},
		
	{path: 'profil', loadChildren: './views/profile/profile.module#ProfileModule'},
];

const extraOptions:ExtraOptions = {
    scrollPositionRestoration: "enabled",
    anchorScrolling: "enabled",
    relativeLinkResolution: 'legacy'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, extraOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }