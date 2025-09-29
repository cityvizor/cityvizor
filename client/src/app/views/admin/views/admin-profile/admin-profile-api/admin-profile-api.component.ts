import { Component } from "@angular/core";
import { AdminService } from "app/services/admin.service";
import { ProfileService } from "app/services/profile.service";
import { Profile } from "app/schema";
import { ToastService } from "app/services/toast.service";
import { environment } from "environments/environment";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: "admin-profile-api",
    templateUrl: "./admin-profile-api.component.html",
    styleUrls: ["./admin-profile-api.component.scss"],
    standalone: true,
    imports: [AsyncPipe],
})
export class AdminProfileApiComponent {
  profileId$ = this.profileService.profileId;

  token?: string;

  apiRoot = environment.api_root;

  constructor(
    private adminService: AdminService,
    private profileService: ProfileService,
    private toastService: ToastService
  ) {}

  async generateToken(profileId: Profile["id"]) {
    this.token = await this.adminService.generateProfileImportToken(profileId);
  }

  async resetTokens(profileId: Profile["id"]) {
    this.adminService.resetProfileImportToken(profileId);
    delete this.token;
    this.toastService.toast("Tokeny byly zneplatněny.", "notice");
  }
}
