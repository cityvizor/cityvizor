import {
  Component,
  OnInit,
  TemplateRef,
  inject,
  ChangeDetectionStrategy,
  signal,
} from "@angular/core";
import { Profile, ProfileType } from "app/schema";
import { ConfigService } from "config/config";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgForm, FormsModule } from "@angular/forms";
import { AdminService } from "app/services/admin.service";
import { AuthService } from "../../../../services/auth.service";
import { filterFn_equalsString, injectTable } from "@tanstack/angular-table";
import {
  adminTableFeatures,
  filterText,
  sortText,
} from "app/shared/admin-table";
import { TableColumnComponent } from "app/shared/components/table-column.component";
import { RouterLink } from "@angular/router";

import {
  BsDropdownDirective,
  BsDropdownToggleDirective,
  BsDropdownMenuDirective,
} from "ngx-bootstrap/dropdown";
import { TranslatePipe } from "@ngx-translate/core";

interface ProfileWithParentName extends Profile {
  parentName: string;
}

@Component({
  selector: "admin-profile-list",
  templateUrl: "./admin-profile-list.component.html",
  styleUrls: ["./admin-profile-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    TableColumnComponent,
    FormsModule,
    RouterLink,
    BsDropdownDirective,
    BsDropdownToggleDirective,
    BsDropdownMenuDirective,
    TranslatePipe,
  ],
})
export class AdminProfileListComponent implements OnInit {
  private adminService = inject(AdminService);
  private modalService = inject(BsModalService);
  configService = inject(ConfigService);
  authService = inject(AuthService);

  readonly profilesWithParentName = signal<ProfileWithParentName[]>([]);
  readonly table = injectTable(() => ({
    features: adminTableFeatures,
    data: this.profilesWithParentName(),
    columns: [
      { accessorKey: "name" },
      { accessorKey: "type", filterFn: filterFn_equalsString },
      { accessorKey: "parentName" },
    ],
    defaultColumn: { filterFn: filterText, sortFn: sortText },
    initialState: { sorting: [{ id: "name", desc: false }] },
    enableSortingRemoval: false,
    enableMultiSort: false,
  }));

  profileTypes = [
    { value: "municipality", label: "Municipalita" },
    { value: "pbo", label: "Příspěvkovka" },
    { value: "external", label: "Externí" },
  ];

  loading: boolean = false;

  currentProfile: Profile;

  modalRef: BsModalRef;

  ngOnInit() {
    this.loadProfiles();
  }

  async loadProfiles(): Promise<void> {
    this.loading = true;
    let profilesByIds = (await this.adminService.getProfiles()).reduce(
      (acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      },
      {},
    );
    this.profilesWithParentName.set(
      this.getProfilesWithParentNames(profilesByIds),
    );
    this.loading = false;
  }

  async createProfile(form: NgForm) {
    const data = form.value;

    await this.adminService.createProfile(data);

    this.loadProfiles();
  }

  async deleteProfile(profileId: Profile["id"]) {
    await this.adminService.deleteProfile(profileId);
    this.loadProfiles();
  }

  getProfilesWithParentNames(
    profilesByIds: Record<number, Profile>,
  ): ProfileWithParentName[] {
    const result: ProfileWithParentName[] = [];

    for (const profileId in profilesByIds) {
      const profile = profilesByIds[profileId];
      const parentProfile = profile.parent
        ? profilesByIds[profile.parent]
        : null;
      const parentName = parentProfile ? parentProfile.name : "žádný";

      result.push({ parentName, ...profile });
    }

    return result;
  }

  openModal(template: TemplateRef<any>) {
    if (this.modalRef) this.modalRef?.hide();
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    if (this.modalRef) this.modalRef?.hide();
  }
}
