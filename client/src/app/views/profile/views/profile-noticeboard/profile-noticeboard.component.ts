import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";

import { DataService } from "app/services/data.service";

import { ProfileService } from "app/services/profile.service";
import { Noticeboard } from "app/schema/noticeboard";
import { DatePipe } from "@angular/common";

@Component({
  selector: "profile-noticeboard",
  templateUrl: "profile-noticeboard.component.html",
  styleUrls: ["profile-noticeboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DatePipe],
})
export class ProfileNoticeboardComponent implements OnInit {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  private profileService = inject(ProfileService);
  private dataService = inject(DataService);

  noticeBoard: Noticeboard;

  infoWindowClosed: boolean;

  edeskyId?: number;

  ngOnInit() {
    this.profileService.profile.subscribe(profile => {
      this.loadData(profile.id);
      this.edeskyId = profile.edesky;
    });
  }

  async loadData(profileId: number) {
    this.noticeBoard = await this.dataService.getProfileNoticeBoard(profileId);

    this.changeDetectorRef.markForCheck();
  }
}
