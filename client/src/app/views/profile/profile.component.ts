import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import {
  ActivatedRoute,
  Params,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { Subscription, Observable } from "rxjs";

import { DataService } from "app/services/data.service";

import { ProfileService } from "app/services/profile.service";
import { Profile } from "app/schema/profile";
import { TitleService } from "app/services/title.service";
import { AsyncPipe } from "@angular/common";
import { HeaderMenuComponent } from "../../shared/components/header-menu/header-menu.component";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "profile",
  templateUrl: "profile.component.html",
  styleUrls: ["profile.component.scss"],
  imports: [
    HeaderMenuComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private profileService = inject(ProfileService);
  private titleService = inject(TitleService);
  private route = inject(ActivatedRoute);

  profile: Observable<Profile>;
  returnLink: string | null = null;

  paramsSubscription: Subscription;

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.returnLink = null;
      this.dataService.getProfile(params["profile"]).then(profile => {
        if (profile) {
          const requestedSelectionProfile = Number(params["selectionProfile"]);
          const selectionProfile =
            Number.isInteger(requestedSelectionProfile) &&
            requestedSelectionProfile > 0
              ? requestedSelectionProfile
              : profile.parent;
          this.returnLink = selectionProfile
            ? `/landing/?selectionProfile=${selectionProfile}`
            : null;
          this.profileService.setProfile(profile);
        }
      });
    });

    this.profile = this.profileService.profile;

    this.profile.subscribe(profile => {
      if (profile) {
        this.titleService.setTitle(profile.name);
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.titleService.setTitle(null);
  }
}
