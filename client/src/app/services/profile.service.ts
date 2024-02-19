import { Injectable } from "@angular/core";

import { Profile } from "app/schema/profile";
import { ReplaySubject, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  profileId = new BehaviorSubject<number | null>(null);

  profile = new ReplaySubject<Profile>(1);

  constructor() {
    this.profile.pipe(map(profile => profile.id)).subscribe(this.profileId);
  }

  async setProfile(profile: Profile): Promise<void> {
    this.profile.next(profile);
  }
}
