import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminProfileListComponent } from './views/admin-profile-list/admin-profile-list.component';
import { AdminUserListComponent } from './views/admin-user-list/admin-user-list.component';
import { AdminProfileComponent } from './views/admin-profile/admin-profile.component';
import { AdminProfileDataComponent } from './views/admin-profile/admin-profile-data/admin-profile-data.component';
import { AdminProfileSettingsComponent } from './views/admin-profile/admin-profile-settings/admin-profile-settings.component';
import { AdminProfileLogsComponent } from './views/admin-profile/admin-profile-logs/admin-profile-logs.component';
import { AdminUserComponent } from './views/admin-user/admin-user.component';
import { AdminProfileApiComponent } from './views/admin-profile/admin-profile-api/admin-profile-api.component';


const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "profily/:profile",
        component: AdminProfileComponent,
        children: [
          { path: "data", component: AdminProfileDataComponent },
          { path: "api", component: AdminProfileApiComponent },
          { path: "logy", component: AdminProfileLogsComponent },
          { path: "nastaveni", component: AdminProfileSettingsComponent },
          { path: "", redirectTo: "data", pathMatch: "full" },
	        { path: '**', redirectTo: '/', pathMatch: 'full' },
        ]
      },
      { path: "profily", component: AdminProfileListComponent },

      { path: "spravci/:user", component: AdminUserComponent },
      { path: "spravci", component: AdminUserListComponent },

      { path: "", redirectTo: "profily", pathMatch: "full" },
	    { path: '**', redirectTo: '/', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
