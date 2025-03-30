import { Component, OnInit, TemplateRef } from "@angular/core";
import { ProfileService } from "app/services/profile.service";
import { map, distinctUntilChanged } from "rxjs/operators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Profile, BudgetYear, ProfileType } from "app/schema";
import { Observable, BehaviorSubject } from "rxjs";
import { AdminService } from "app/services/admin.service";

@Component({
  selector: "admin-profile-data",
  templateUrl: "./admin-profile-data.component.html",
  styleUrls: ["./admin-profile-data.component.scss"],
})
export class AdminProfileDataComponent implements OnInit {
  profile$: Observable<Profile>;

  profileId: number;
  profileType: ProfileType;

  years: BudgetYear[] = [];

  currentYear: number;
  currentYearBudget?: BudgetYear;

  loading: boolean = false;

  modalRef?: BsModalRef;

  constructor(
    private profileService: ProfileService,
    private adminService: AdminService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.profile$ = this.profileService.profile;

    this.profile$
      .pipe(
        map(profile => profile),
        distinctUntilChanged()
      )
      .subscribe(profile => {
        this.profileId = profile.id;
        this.profileType = profile.type;
        this.loadYears(profile.id);
      });
  }

  async loadYears(profileId: number | null) {
    this.years = [];

    if (!profileId) return;

    this.loading = true;
    this.years = await this.adminService.getProfileYears(profileId);
    this.loading = false;

    this.years.sort((a, b) => a.year - b.year);
  }

  openModal(modal: TemplateRef<any>) {
    if (this.modalRef) this.modalRef.hide();
    this.modalRef = this.modalService.show(modal);
  }

  closeModal(changed: boolean) {
    if (this.modalRef) this.modalRef.hide();
    delete this.modalRef;

    if (changed) this.loadYears(this.profileId);
  }

  async hideYear(year: BudgetYear) {
    await this.adminService.updateProfileYear(this.profileId, year.year, {
      hidden: true,
    });
    year.hidden = true;
  }

  async publishYear(year: BudgetYear) {
    await this.adminService.updateProfileYear(this.profileId, year.year, {
      hidden: false,
    });
    year.hidden = false;
  }

  downloadYear(year: BudgetYear) {
    window.location.href = `/api/exports/profiles/${this.profileId}/all/${year.year}`;
  }
}
