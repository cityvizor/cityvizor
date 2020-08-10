import { Component, OnInit, Inject } from '@angular/core';
import { ProfileService } from 'app/services/profile.service';
import { Observable } from 'rxjs';
import { Profile } from 'app/schema';
import { first, map } from 'rxjs/operators';
import { AdminService } from 'app/services/admin.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IAppConfig, AppConfig } from 'config/config';
import { ToastService } from 'app/services/toast.service';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'admin-profile-settings',
  templateUrl: './admin-profile-settings.component.html',
  styleUrls: ['./admin-profile-settings.component.scss']
})
export class AdminProfileSettingsComponent implements OnInit {

  profileId: Observable<number | null>;

  profile: Profile;

  constructor(
    private profileService: ProfileService,
    private adminService: AdminService,
    private dataService: DataService,
    private router: Router,
    private toastService: ToastService,
    @Inject(AppConfig) public config: IAppConfig
  ) { }

  ngOnInit() {
    this.profileId = this.profileService.profileId;

    this.profileId.subscribe(profileId => {
      if(profileId) this.loadProfile(profileId)
    });
  }

  async loadProfile(profileId: number) {
    this.profile = await this.adminService.getProfile(profileId);
  }

  async saveProfile(form: NgForm) {
    const data = form.value;

    await this.adminService.saveProfile(this.profile.id, data)
    this.reloadProfile();

    this.toastService.toast("Uloženo.", "notice")

  }

  async icoAutofill(ico: string) {
    if (/\d{8}/.test(ico)) {
      const results = await this.dataService.searchForCities(ico)
      if (results.length == 1) {
        const data = results[0]

        // The coords from the search are too long and will fail the validation, so trim them
        const trim = (coords: number) => Number(coords.toString().substring(0, 10))
        this.profile.gpsX = trim(data.souradnice[0])
        this.profile.gpsY = trim(data.souradnice[1])
        if (this.profile.avatarUrl == null || data.urlZnak) {
          await this.adminService.saveProfileAvatarFromUrl(this.profile.id, data.urlZnak)
          // Force the avatar to show without reloading the page (reloading would result in loss of autofilled coords)
          this.profile.avatarType = data.urlZnak
        }
        
      }
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
    return this.dataService.getProfileAvatarUrl(profile);
  }

  async reloadProfile(){
    const profile = await this.adminService.getProfile(this.profile.id);
    this.profileService.setProfile(profile);
  }

}
