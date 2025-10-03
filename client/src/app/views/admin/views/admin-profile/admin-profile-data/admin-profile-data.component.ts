import { Component, OnInit, TemplateRef, inject } from "@angular/core";
import { ProfileService } from "app/services/profile.service";
import { map, distinctUntilChanged } from "rxjs/operators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Profile, BudgetYear, ProfileType } from "app/schema";
import { Observable } from "rxjs";
import { AdminService } from "app/services/admin.service";
import { AsyncPipe, DatePipe } from "@angular/common";
import {
  BsDropdownDirective,
  BsDropdownToggleDirective,
  BsDropdownMenuDirective,
} from "ngx-bootstrap/dropdown";
import { DataUploadModalComponent } from "../../../components/data-upload-modal/data-upload-modal.component";
import { AddModifyYearModalComponent } from "../../../components/add-modify-year-modal/add-modify-year-modal.component";
import { DeleteYearModalComponent } from "../../../components/delete-year-modal/delete-year-modal.component";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "admin-profile-data",
  templateUrl: "./admin-profile-data.component.html",
  styleUrls: ["./admin-profile-data.component.scss"],
  imports: [
    BsDropdownDirective,
    BsDropdownToggleDirective,
    BsDropdownMenuDirective,
    DataUploadModalComponent,
    AddModifyYearModalComponent,
    DeleteYearModalComponent,
    AsyncPipe,
    DatePipe,
    TranslatePipe,
  ],
})
export class AdminProfileDataComponent implements OnInit {
  private profileService = inject(ProfileService);
  private adminService = inject(AdminService);
  private modalService = inject(BsModalService);

  profile$: Observable<Profile>;

  profileId: number;
  profileType: ProfileType;

  years: BudgetYear[] = [];

  currentYear: number;
  currentYearBudget?: BudgetYear;

  loading: boolean = false;

  modalRef?: BsModalRef;

  ngOnInit() {
    this.profile$ = this.profileService.profile;

    this.profile$
      .pipe(
        map(profile => profile),
        distinctUntilChanged(),
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
    if (this.modalRef) this.modalRef?.hide();
    this.modalRef = this.modalService.show(modal);
  }

  closeModal(changed: boolean) {
    if (this.modalRef) this.modalRef?.hide();
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
