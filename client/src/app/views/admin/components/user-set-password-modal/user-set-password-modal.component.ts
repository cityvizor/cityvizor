import { Component, Input, Output, EventEmitter } from "@angular/core";
import { User } from "app/schema";
import { NgForm } from "@angular/forms";
import { ToastService } from "app/services/toast.service";
import { AdminService } from "app/services/admin.service";

@Component({
  selector: "user-set-password-modal",
  templateUrl: "./user-set-password-modal.component.html",
  styleUrls: ["./user-set-password-modal.component.scss"],
})
export class UserSetPasswordModalComponent {
  @Input() user: User;

  passwordMatch: boolean | null = null;

  @Output() close = new EventEmitter<boolean>();

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  async saveUser(form: NgForm) {
    await this.adminService.saveUser(this.user.id, form.value);
    this.toastService.toast("Uloženo.", "notice");
    this.close.emit(true);
  }

  checkPasswordMatch(password1: string, password2: string) {
    if (password1 && password2 && password1 === password2)
      this.passwordMatch = true;
    if (password1 && password2 && password1 !== password2)
      this.passwordMatch = false;
    if (!password1 || !password2) this.passwordMatch = null;
  }
}
