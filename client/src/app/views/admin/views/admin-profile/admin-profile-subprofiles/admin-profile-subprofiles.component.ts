import { Component, OnInit, TemplateRef, inject } from "@angular/core";
import { Profile } from "app/schema/profile";
import { DataService } from "app/services/data.service";
import { ProfileService } from "app/services/profile.service";
import { ConfigService } from "config/config";
import { Observable } from "rxjs";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { AdminService } from "app/services/admin.service";
import { NgForm, FormsModule } from "@angular/forms";
import { map } from "rxjs/operators";
import { TableModule } from "primeng/table";
import { PrimeTemplate } from "primeng/api";
import { SelectModule } from "primeng/select";
import { RouterLink } from "@angular/router";

import {
  BsDropdownDirective,
  BsDropdownToggleDirective,
  BsDropdownMenuDirective,
} from "ngx-bootstrap/dropdown";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "admin-profile-subprofiles",
  templateUrl: "./admin-profile-subprofiles.component.html",
  styleUrls: ["./admin-profile-subprofiles.component.scss"],
  imports: [
    TableModule,
    PrimeTemplate,
    SelectModule,
    FormsModule,
    RouterLink,
    BsDropdownDirective,
    BsDropdownToggleDirective,
    BsDropdownMenuDirective,
    TranslatePipe,
  ],
})
export class AdminProfileSubprofilesComponent implements OnInit {
  private profileService = inject(ProfileService);
  private dataService = inject(DataService);
  private adminService = inject(AdminService);
  configService = inject(ConfigService);
  private modalService = inject(BsModalService);

  subprofiles: Profile[] = [];
  profileId: Number;
  profileId$: Observable<Number>;
  currentProfile: Profile;
  modalRef: BsModalRef;

  profileTypes = [
    { value: "municipality", label: "Municipalita" },
    { value: "pbo", label: "Příspěvkovka" },
    { value: "external", label: "Externí" },
  ];

  async ngOnInit() {
    this.profileId$ = this.profileService.profile.pipe(
      map(profile => profile.id),
    );

    this.profileId$.subscribe(profileId => {
      this.loadSubprofiles(profileId);
    });
  }

  async loadSubprofiles(profileId: Number) {
    this.profileId = profileId;
    this.subprofiles = (await this.dataService.getProfiles()).filter(
      profile => profile.parent == profileId,
    );
  }

  openModal(template: TemplateRef<any>) {
    if (this.modalRef) this.modalRef.hide();
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    if (this.modalRef) this.modalRef.hide();
  }

  async createProfile(form: NgForm) {
    const data = form.value;

    await this.adminService.createProfile(data);

    this.loadSubprofiles(this.profileId);
  }

  async deleteProfile(profileId: Profile["id"]) {
    await this.adminService.deleteProfile(profileId);
    this.loadSubprofiles(this.profileId);
  }
}
