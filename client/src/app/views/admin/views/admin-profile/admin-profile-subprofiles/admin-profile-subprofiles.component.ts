import { Component, OnInit, TemplateRef } from "@angular/core";
import { Profile } from "app/schema/profile";
import { DataService } from "app/services/data.service";
import { ProfileService } from "app/services/profile.service";
import { ConfigService } from "config/config";
import { Observable } from "rxjs";
import { map } from "rxjs/internal/operators/map";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { AdminService } from "app/services/admin.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "admin-profile-subprofiles",
  templateUrl: "./admin-profile-subprofiles.component.html",
  styleUrls: ["./admin-profile-subprofiles.component.scss"],
})
export class AdminProfileSubprofilesComponent implements OnInit {
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

  constructor(
    private profileService: ProfileService,
    private dataService: DataService,
    private adminService: AdminService,
    public configService: ConfigService,
    private modalService: BsModalService
  ) {}

  async ngOnInit() {
    this.profileId$ = this.profileService.profile.pipe(
      map(profile => profile.id)
    );

    this.profileId$.subscribe(profileId => {
      this.loadSubprofiles(profileId);
    });
  }

  async loadSubprofiles(profileId: Number) {
    this.profileId = profileId;
    this.subprofiles = (await this.dataService.getProfiles()).filter(
      profile => profile.parent == profileId
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
