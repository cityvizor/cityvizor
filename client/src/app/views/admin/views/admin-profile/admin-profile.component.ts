import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { Profile } from 'app/schema';

import { ProfileService } from 'app/services/profile.service';
import { AdminService } from 'app/services/admin.service';

@Component({
  selector: 'admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {

  profile: Observable<Profile>;

  constructor(private route: ActivatedRoute, private adminService: AdminService, private profileService: ProfileService) { }

  ngOnInit() {

    this.route.params.pipe(map(params => Number(params["profile"])), distinctUntilChanged())
      .subscribe(profileId => {
        this.adminService.getProfile(profileId).then(profile => {
          this.profileService.setProfile(profile);
        })
      });

    this.profile = this.profileService.profile;

  }
}
