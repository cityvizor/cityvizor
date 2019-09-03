import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminProfileListComponent } from './views/admin-profile-list/admin-profile-list.component';
import { AdminUserListComponent } from './views/admin-user-list/admin-user-list.component';


const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      { path: "profily", component: AdminProfileListComponent },
      { path: "uzivatele", component: AdminUserListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
