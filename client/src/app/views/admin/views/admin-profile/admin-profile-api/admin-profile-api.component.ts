import {
  ChangeDetectorRef,
  Component,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AsyncPipe],
})
export class AdminProfileApiComponent {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  private adminService = inject(AdminService);
  private profileService = inject(ProfileService);
  private toastService = inject(ToastService);

  profileId$ = this.profileService.profileId;

  token?: string;

  apiRoot = environment.api_root;

  async generateToken(profileId: Profile["id"]) {
    this.token = await this.adminService.generateProfileImportToken(profileId);

    this.changeDetectorRef.markForCheck();
  }

  async resetTokens(profileId: Profile["id"]) {
    this.adminService.resetProfileImportToken(profileId);
    delete this.token;
    this.toastService.toast("Tokeny byly zneplatněny.", "notice");
  }
}
