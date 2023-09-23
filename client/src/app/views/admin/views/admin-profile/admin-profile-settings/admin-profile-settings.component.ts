import { Component, OnInit, Inject } from '@angular/core';
import { ProfileService } from 'app/services/profile.service';
import { Observable } from 'rxjs';
import { Profile, ProfileType } from 'app/schema';
import { AdminService } from 'app/services/admin.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from 'config/config';
import { ToastService } from 'app/services/toast.service';
import { DataService } from 'app/services/data.service';
import { PboCategory } from 'app/schema/pbo-category';

@Component({
  selector: 'admin-profile-settings',
  templateUrl: './admin-profile-settings.component.html',
  styleUrls: ['./admin-profile-settings.component.scss']
})
export class AdminProfileSettingsComponent implements OnInit {
  profileId: Observable<number | null>;
  profile: Profile;
  profiles: Profile[];
  profilesValidAsParent: Profile[];
  parentProfileName?: string;
  pboCategories: PboCategory[];
  profileIdParentIdMap: Map<number, number | null>;

  constructor(
    private profileService: ProfileService,
    private adminService: AdminService,
    private dataService: DataService,
    private router: Router,
    private toastService: ToastService,
    public configService: ConfigService
  ) { }

  async ngOnInit() {
    this.profileId = this.profileService.profileId;
    this.profiles = await this.dataService.getProfiles();
    this.initializeProfileParentMap();
    this.updateProfilesValidAsParent();
    this.pboCategories = await this.adminService.getPboCategories();

    this.profileId.subscribe(profileId => {
      if (profileId) this.loadProfile(profileId)
    });
  }

  initializeProfileParentMap() {
    const idParentPairs = this.profiles.map((profile) => [profile.id, profile.parent] as [number, number | null]);
    this.profileIdParentIdMap = new Map(idParentPairs);
  }

  async loadProfile(profileId: number) {
    this.profile = await this.adminService.getProfile(profileId);

    // Use default PBO category if not set
    if (this.profile.type === "pbo" && this.pboCategories.length > 0) {
      this.profile.pboCategoryId ??= this.pboCategories[0].pboCategoryId;
    }

    this.updateProfilesValidAsParent();
  }

  async reloadProfile() {
    this.loadProfile(this.profile.id);
    this.profileService.setProfile(this.profile);
  }

  async saveProfile(form: NgForm) {
    const data = form.value;

    if (data.parent == "null") data.parent = null;

    await this.adminService.saveProfile(this.profile.id, data)

    this.reloadProfile();

    this.toastService.toast("Uloženo.", "notice")
  }


  /**
   * Filters array of all {@link profiles} and updates the {@link profilesValidAsParent} array
   * used to populate the Parent profile selection dropdown.
   * Filters out profiles that have a grandparent and the current profile itself (if already loaded).
   */
  updateProfilesValidAsParent() {
    if (this.profile == null || this.profiles == null) {
      this.profilesValidAsParent = [];
    }
    else {
      this.profilesValidAsParent = this.profiles.filter(p => p.type == "municipality"
        && (p.parent == null || (this.profile.type == "pbo" && this.profileIdParentIdMap[p.parent] == null))
        && (this.profile.id !== p.id));
    }
  }

  async uploadAvatar(fileInput: HTMLInputElement) {
    const file = fileInput.files ? fileInput.files[0] : null;
    if (!file) return;

    let formData: FormData = new FormData();

    formData.set("avatar", file, file.name);

    if (file.size && file.size / 1024 / 1024 > 1) {
      this.toastService.toast("Soubor znaku je příliš veliký.", "notice");
      return;
    }

    const allowedTypes = ['png', 'jpg', 'jpe', 'jpeg', 'gif', 'svg'];
    const extension = file.name.split(".").pop() || ""
    if (allowedTypes.indexOf(extension) == -1) {
      this.toastService.toast(`Nepovolený formát souboru. Povolené formáty: ${allowedTypes.join(", ")}`, "notice");
      return;
    }
    await this.adminService.saveProfileAvatar(this.profile.id, formData);
    this.reloadProfile();

    this.toastService.toast("Uloženo.", "notice");
  }

  async deleteAvatar() {
    await this.adminService.deleteProfileAvatar(this.profile.id);
    this.reloadProfile();
    this.toastService.toast("Uloženo.", "notice");
  }

  getProfileAvatarUrl(profile: Profile): string | null {
    return this.adminService.getProfileAvatarUrl(profile);
  }

  getParentProfileName() {
    return this.profiles.find(p => p.id === this.profile.parent)?.name;
  }

  onProfileTypeChange(newValue: ProfileType) {
    if (this.profile) {
      this.profile.type = newValue;
    }
  }
}
