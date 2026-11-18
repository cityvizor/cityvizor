import {
  Component,
  OnInit,
  TemplateRef,
  inject,
  ChangeDetectionStrategy,
  signal,
} from "@angular/core";
import { AdminService } from "app/services/admin.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { User } from "app/schema";
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
import { CreateUserModalComponent } from "../../components/create-user-modal/create-user-modal.component";
import { UserSetPasswordModalComponent } from "../../components/user-set-password-modal/user-set-password-modal.component";
import { DatePipe } from "@angular/common";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "admin-user-list",
  templateUrl: "./admin-user-list.component.html",
  styleUrls: ["./admin-user-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    TableColumnComponent,
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

  readonly users = signal<User[]>([]);
  readonly table = injectTable(() => ({
    features: adminTableFeatures,
    data: this.users(),
    columns: [
      { accessorKey: "name" },
      { accessorKey: "email" },
      { accessorKey: "login" },
      { accessorKey: "role", filterFn: filterFn_equalsString },
      { accessorKey: "lastLogin" },
    ],
    defaultColumn: { filterFn: filterText, sortFn: sortText },
    initialState: { sorting: [{ id: "name", desc: false }] },
    enableSortingRemoval: false,
    enableMultiSort: false,
  }));

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
    this.users.set([]);
    this.loading = true;
    const userData = await this.adminService.getUsers();
    this.users.set(
      userData.map(user => {
        if (user.role == null || user.role === "") {
          user.role = "-";
        }
        return user;
      }),
    );
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
