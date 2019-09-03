import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

import { SharedModule } from 'app/shared/shared.module';

import { AdminProfileListComponent } from './views/admin-profile-list/admin-profile-list.component';
import { AdminUserListComponent } from './views/admin-user-list/admin-user-list.component';


@NgModule({
  declarations: [
    AdminComponent,
    AdminProfileListComponent,
    AdminUserListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
