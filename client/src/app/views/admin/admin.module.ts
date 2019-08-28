import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

import { UserAdminComponent } from './views/user-admin/user-admin.component';
import { UserAdminAccountComponent } from './views/user-admin/user-admin-account/user-admin-account.component';

import { SiteAdminComponent } from './views/site-admin/site-admin.component';
import { SiteAdminProfileComponent } from './views/site-admin/site-admin-profile/site-admin-profile.component';
import { SiteAdminProfilesComponent } from './views/site-admin/site-admin-profiles/site-admin-profiles.component';
import { SiteAdminUserComponent } from './views/site-admin/site-admin-user/site-admin-user.component';
import { SiteAdminUsersComponent } from './views/site-admin/site-admin-users/site-admin-users.component';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [
    AdminComponent,

    SiteAdminComponent,
    SiteAdminProfileComponent,
    SiteAdminProfilesComponent,
    SiteAdminUserComponent,
    SiteAdminUsersComponent,

    UserAdminComponent,
    UserAdminAccountComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
