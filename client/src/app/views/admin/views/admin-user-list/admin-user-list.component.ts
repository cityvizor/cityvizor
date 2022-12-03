import { Component, OnInit, TemplateRef } from '@angular/core';
import { AdminService } from 'app/services/admin.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from 'app/schema';

@Component({
  selector: 'admin-user-list',
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.scss']
})
export class AdminUserListComponent implements OnInit {

  users: User[];

  currentUser: User;

  loading: boolean = false;

  modalRef: BsModalRef;

  roles = [
    { value: "admin", label: "Admin" },
    { value: "profile-admin", label: "Profile admin" },
    { value: "", label: "Žádná" },
  ]

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    this.users = [];
    this.loading = true;
    this.users = await this.adminService.getUsers();
    this.loading = false;
  }

  async deleteUser(userId: User["id"]) {
    await this.adminService.deleteUser(userId);
    this.loadUsers();
  }

  openModal(template: TemplateRef<any>) {
    if (this.modalRef) this.modalRef.hide();
    this.modalRef = this.modalService.show(template);
  }

  closeModal(changes: boolean) {
    if (this.modalRef) this.modalRef.hide();
    if (changes) this.loadUsers();
  }

}
