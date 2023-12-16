import {Component, OnInit, TemplateRef} from '@angular/core';
import {Profile, ProfileType} from 'app/schema';
import {ConfigService} from 'config/config';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {NgForm} from '@angular/forms';
import {AdminService} from 'app/services/admin.service';
import {AuthService} from "../../../../services/auth.service";

interface ProfileWithParentName extends Profile {
    parentName: String
}

@Component({
    selector: 'admin-profile-list',
    templateUrl: './admin-profile-list.component.html',
    styleUrls: ['./admin-profile-list.component.scss']
})
export class AdminProfileListComponent implements OnInit {
    profilesWithParentName: ProfileWithParentName[] = [];

    profileTypes = [
        { value: "municipality", label: "Municipalita" },
        { value: "pbo", label: "Příspěvkovka" },
        { value: "external", label: "Externí" },
    ];

    loading: boolean = false;

    currentProfile: Profile;

    modalRef: BsModalRef;

    constructor(
        private adminService: AdminService,
        private modalService: BsModalService,
        public configService: ConfigService,
        public authService: AuthService,
    ) {
    }

    ngOnInit() {
        this.loadProfiles();
    }

    async loadProfiles(): Promise<void> {
        this.loading = true;
        let profilesByIds =  (await this.adminService.getProfiles()).reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {});
        this.profilesWithParentName = this.getProfilesWithParentNames(profilesByIds);
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

    getProfilesWithParentNames(profilesByIds: Record<number, Profile>): ProfileWithParentName[] {
        const result: ProfileWithParentName[] = [];
      
        for (const profileId in profilesByIds) {
          const profile = profilesByIds[profileId];
          const parentProfile = profile.parent ? profilesByIds[profile.parent] : null;
          const parentName = parentProfile ? parentProfile.name : 'žádný';
      
          result.push({ parentName, ...profile});
        }

        result.sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'}));
        return result;
    }

    openModal(template: TemplateRef<any>) {
        if (this.modalRef) this.modalRef.hide();
        this.modalRef = this.modalService.show(template);
    }

    closeModal() {
        if (this.modalRef) this.modalRef.hide();
    }
}
