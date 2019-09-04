import { Injectable } from '@angular/core';

import { DataService } from 'app/services/data.service';
import { Profile } from 'app/schema/profile';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class ProfileService {

  profileId = new BehaviorSubject<number | null>(null);

  profile = new ReplaySubject<Profile>(1);

  constructor(private dataService: DataService) {
    this.profile.pipe(map(profile => profile.id)).subscribe(this.profileId);
  }

  async setProfile(profileId: number): Promise<void> {
    await this.dataService.getProfile(profileId).then(profile => this.profile.next(profile));
  }

  async reloadProfile() {
    if (this.profileId.value) await this.setProfile(this.profileId.value);
  }
}
