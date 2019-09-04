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

  }

  openCreateProfile(template: TemplateRef<any>) {
    if (this.modalRef) this.modalRef.hide();
    this.modalRef = this.modalService.show(template);
  }
}
