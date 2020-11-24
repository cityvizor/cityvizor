import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Profile } from 'app/schema';
import { IAppConfig, AppConfig } from 'config/config';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';
import { AdminService } from 'app/services/admin.service';

@Component({
  selector: 'admin-profile-list',
  templateUrl: './admin-profile-list.component.html',
  styleUrls: ['./admin-profile-list.component.scss']
})
export class AdminProfileListComponent implements OnInit {

  profiles: Profile[] = [];

  loading: boolean = false;

  currentProfile: Profile;

  modalRef: BsModalRef;

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService,
    @Inject(AppConfig) public config: IAppConfig
  ) { }

  ngOnInit() {
    this.loadProfiles();
  }

  async loadProfiles(): Promise<void> {
    this.profiles = [];
    this.loading = true;
    this.profiles = await this.adminService.getProfiles();
    this.loading = false;
    this.profiles.sort((a, b) => a.name.localeCompare(b.name));
  }

  async createProfile(form: NgForm) {

    const data = form.value;

    const profile = await this.adminService.createProfile(data);

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
