import { Component, OnInit, Inject } from '@angular/core';
import { AdminService } from 'app/services/admin.service';
import { ProfileService } from 'app/services/profile.service';
import { Profile } from 'app/schema';
import { ToastService } from 'app/services/toast.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'admin-profile-api',
  templateUrl: './admin-profile-api.component.html',
  styleUrls: ['./admin-profile-api.component.scss']
})
export class AdminProfileApiComponent implements OnInit {

  profileId$ = this.profileService.profileId;

  token: string;

  apiRoot = environment.api_root;

  constructor(
    private adminService: AdminService,
    private profileService: ProfileService,
    private toastService: ToastService
  ) { }

  ngOnInit() {

  }

  async generateToken(profileId: Profile["id"]) {
    this.token = await this.adminService.generateProfileImportToken(profileId);
  }

  async resetTokens(profileId: Profile["id"]) {
    this.adminService.resetProfileImportToken(profileId);
    delete this.token;
    this.toastService.toast("Tokeny byly zneplatněny.", "notice");
  }

}
