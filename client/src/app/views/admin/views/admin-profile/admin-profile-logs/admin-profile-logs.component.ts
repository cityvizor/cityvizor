import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { ProfileService } from "app/services/profile.service";
import { AdminService } from "app/services/admin.service";
import { map } from "rxjs/operators";
import { Profile } from "app/schema";
import { Observable } from "rxjs";
import { Import } from "app/schema/import";
import { DatePipe } from "@angular/common";

@Component({
  selector: "admin-profile-logs",
  templateUrl: "./admin-profile-logs.component.html",
  styleUrls: ["./admin-profile-logs.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DatePipe],
})
export class AdminProfileLogsComponent implements OnInit {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  private profileService = inject(ProfileService);
  private adminService = inject(AdminService);

  profileId$: Observable<Profile["id"]>;

  logs: Import[] = [];
  hidden: Object = {};

  ngOnInit() {
    this.profileId$ = this.profileService.profile.pipe(
      map(profile => profile.id),
    );

    this.profileId$.subscribe(profileId => {
      this.loadImports(profileId);
    });
  }

  async loadImports(profileId) {
    const logs = await this.adminService.getProfileImports(profileId);
    this.logs = logs;

    this.changeDetectorRef.markForCheck();
  }
}
