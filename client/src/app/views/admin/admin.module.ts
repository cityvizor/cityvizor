import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

import { SharedModule } from 'app/shared/shared.module';

import { AdminProfileListComponent } from './views/admin-profile-list/admin-profile-list.component';
import { AdminUserListComponent } from './views/admin-user-list/admin-user-list.component';
import { AdminProfileComponent } from './views/admin-profile/admin-profile.component';
import { AdminProfileDataComponent } from './views/admin-profile/admin-profile-data/admin-profile-data.component';
import { AdminProfileSettingsComponent } from './views/admin-profile/admin-profile-settings/admin-profile-settings.component';
import { AdminProfileLogsComponent } from './views/admin-profile/admin-profile-logs/admin-profile-logs.component';

import { DataUploadModalComponent } from './components/data-upload-modal/data-upload-modal.component';
import { CreateYearModalComponent } from './components/create-year-modal/create-year-modal.component';
import { DeleteYearModalComponent } from './components/delete-year-modal/delete-year-modal.component';
import { CreateProfileModalComponent } from './components/create-profile-modal/create-profile-modal.component';
import { CreateUserModalComponent } from './components/create-user-modal/create-user-modal.component';
import { AdminUserComponent } from './views/admin-user/admin-user.component';
import { ManagedProfilesSelectorComponent } from './components/managed-profiles-selector/managed-profiles-selector.component';
import { AdminProfileApiComponent } from './views/admin-profile/admin-profile-api/admin-profile-api.component';
import { UserSetPasswordModalComponent } from './components/user-set-password-modal/user-set-password-modal.component';


@NgModule({
  declarations: [
    AdminComponent,
    AdminProfileListComponent,
    AdminUserListComponent,
    AdminProfileComponent,
    AdminProfileDataComponent,
    AdminProfileSettingsComponent,
    AdminProfileLogsComponent,
    
    DataUploadModalComponent,
    
    CreateYearModalComponent,
    
    DeleteYearModalComponent,
    
    CreateProfileModalComponent,
    
    CreateUserModalComponent,
    
    AdminUserComponent,
    
    ManagedProfilesSelectorComponent,
    
    AdminProfileApiComponent,
    
    UserSetPasswordModalComponent,
    
  ],
  entryComponents: [
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
