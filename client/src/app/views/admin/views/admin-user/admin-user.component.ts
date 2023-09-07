import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'app/services/admin.service';
import { User, Profile } from 'app/schema';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { ToastService } from 'app/services/toast.service';

@Component({
  selector: 'admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit, OnDestroy {

  user: User;

  managedProfiles: Profile["id"][];

  modalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private modalService: BsModalService,
    private toastService: ToastService
  ) { }

  ngOnInit() {

    this.route.params.pipe(map(params => Number(params["user"])), distinctUntilChanged())
      .subscribe(userId => this.loadUser(userId))

  }

  ngOnDestroy() {
    if (this.modalRef) this.modalRef.hide();
  }

  async loadUser(userId: number) {
    this.user = await this.adminService.getUser(userId);
    this.managedProfiles = await this.adminService.getUserProfiles(userId);
  }

  async saveUser(form: NgForm) {
    await this.adminService.saveUser(this.user.id, form.value);
    await this.adminService.saveUserProfiles(this.user.id, this.managedProfiles);
    await this.loadUser(this.user.id);
    this.toastService.toast("Uloženo.", "notice")
  }

  openModal(template: TemplateRef<any>) {
    if (this.modalRef) this.modalRef.hide();
    this.modalRef = this.modalService.show(template, { class: "modal-lg" });
  }

  closeModal() {
    if (this.modalRef) this.modalRef.hide();
  }

}
