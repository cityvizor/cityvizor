import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'app/services/profile.service';
import { AdminService } from 'app/services/admin.service';
import { map } from 'rxjs/operators';
import { Profile } from 'app/schema';
import { Observable } from 'rxjs';
import { Import } from 'app/schema/import';

@Component({
  selector: 'admin-profile-logs',
  templateUrl: './admin-profile-logs.component.html',
  styleUrls: ['./admin-profile-logs.component.scss']
})
export class AdminProfileLogsComponent implements OnInit {

  profileId$: Observable<Profile["id"]>;

  logs: Import[] = [];
  hidden: Object = {};

  constructor(
    private profileService: ProfileService,
    private adminService: AdminService,
  ) { }

  ngOnInit() {
    this.profileId$ = this.profileService.profile.pipe(map(profile => profile.id));

    this.profileId$.subscribe(profileId => {
      this.loadImports(profileId);
    });
  }

  async loadImports(profileId) {
    this.logs = await this.adminService.getProfileImports(profileId);
  }

}
