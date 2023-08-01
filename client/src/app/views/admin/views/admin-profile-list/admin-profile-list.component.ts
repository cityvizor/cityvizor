import {Component, OnInit, TemplateRef} from '@angular/core';
import {Profile, ProfileType} from 'app/schema';
import {ConfigService} from 'config/config';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {NgForm} from '@angular/forms';
import {AdminService} from 'app/services/admin.service';
import {AuthService} from "../../../../services/auth.service";

@Component({
    selector: 'admin-profile-list',
    templateUrl: './admin-profile-list.component.html',
    styleUrls: ['./admin-profile-list.component.scss']
})
export class AdminProfileListComponent implements OnInit {

    profiles: Profile[] = [];

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
        this.profiles = [];
        this.loading = true;
        this.profiles = (await this.adminService.getProfiles())
            .filter((profile) => {
                    return this.authService.userManagesProfile(profile.id)
                }
            )
            .sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'}));
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

    openModal(template: TemplateRef<any>) {
        if (this.modalRef) this.modalRef.hide();
        this.modalRef = this.modalService.show(template);
    }

    closeModal() {
        if (this.modalRef) this.modalRef.hide();
    }
}
