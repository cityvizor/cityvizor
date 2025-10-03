import { Component, OnInit, TemplateRef, inject } from "@angular/core";
import { AdminService } from "app/services/admin.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { User } from "app/schema";
import { TableModule } from "primeng/table";
import { PrimeTemplate } from "primeng/api";
import { SelectModule } from "primeng/select";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import {
  BsDropdownDirective,
  BsDropdownToggleDirective,
  BsDropdownMenuDirective,
} from "ngx-bootstrap/dropdown";
import { CreateUserModalComponent } from "../../components/create-user-modal/create-user-modal.component";
import { UserSetPasswordModalComponent } from "../../components/user-set-password-modal/user-set-password-modal.component";
import { DatePipe } from "@angular/common";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "admin-user-list",
  templateUrl: "./admin-user-list.component.html",
  styleUrls: ["./admin-user-list.component.scss"],
  imports: [
    TableModule,
    PrimeTemplate,
    SelectModule,
    FormsModule,
    RouterLink,
    BsDropdownDirective,
    BsDropdownToggleDirective,
    BsDropdownMenuDirective,
    CreateUserModalComponent,
    UserSetPasswordModalComponent,
    DatePipe,
    TranslatePipe,
  ],
})
export class AdminUserListComponent implements OnInit {
  private adminService = inject(AdminService);
  private modalService = inject(BsModalService);

  users: User[];

  currentUser: User;

  loading: boolean = false;

  modalRef: BsModalRef;

  roles = [
    { value: "admin", label: "Admin" },
    { value: "profile-admin", label: "Profile admin" },
    { value: "-", label: "Žádná" },
  ];

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    this.users = [];
    this.loading = true;
    const userData = await this.adminService.getUsers();
    this.users = userData.map(user => {
      if (user.role == null || user.role === "") {
        user.role = "-";
      }
      return user;
    });
    this.loading = false;
  }

  async deleteUser(userId: User["id"]) {
    await this.adminService.deleteUser(userId);
    this.loadUsers();
  }

  openModal(template: TemplateRef<any>) {
    if (this.modalRef) this.modalRef?.hide();
    this.modalRef = this.modalService.show(template);
  }

  closeModal(changes: boolean) {
    if (this.modalRef) this.modalRef?.hide();
    if (changes) this.loadUsers();
  }
}
