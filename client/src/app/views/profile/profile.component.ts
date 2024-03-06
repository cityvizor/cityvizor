import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription, Observable } from "rxjs";

import { DataService } from "app/services/data.service";

import { ProfileService } from "app/services/profile.service";
import { Profile } from "app/schema/profile";
import { TitleService } from "app/services/title.service";

@Component({
  moduleId: module.id,
  selector: "profile",
  templateUrl: "profile.component.html",
  styleUrls: ["profile.component.scss"],
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: Observable<Profile>;

  paramsSubscription: Subscription;

  constructor(
    private dataService: DataService,
    private profileService: ProfileService,
    private titleService: TitleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.dataService.getProfile(params["profile"]).then(profile => {
        if (profile) {
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
