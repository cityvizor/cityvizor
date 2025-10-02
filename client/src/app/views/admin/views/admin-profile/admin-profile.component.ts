import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, RouterLinkActive, RouterLink, RouterOutlet } from "@angular/router";

import { Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";

import { Profile } from "app/schema";

import { ProfileService } from "app/services/profile.service";
import { AdminService } from "app/services/admin.service";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: "admin-profile",
    templateUrl: "./admin-profile.component.html",
    styleUrls: ["./admin-profile.component.scss"],
    imports: [
        RouterLinkActive,
        RouterLink,
        RouterOutlet,
        AsyncPipe,
    ]
})
export class AdminProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private adminService = inject(AdminService);
  private profileService = inject(ProfileService);

  profile: Observable<Profile>;

  ngOnInit() {
    this.route.params
      .pipe(
        map(params => Number(params["profile"])),
        distinctUntilChanged()
      )
      .subscribe(profileId => {
        this.adminService.getProfile(profileId).then(profile => {
          this.profileService.setProfile(profile);
        });
      });

    this.profile = this.profileService.profile;
  }
}
