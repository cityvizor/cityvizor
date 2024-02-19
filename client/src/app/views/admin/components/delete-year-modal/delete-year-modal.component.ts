import { Component, Input, Output, EventEmitter } from "@angular/core";
import { AdminService } from "app/services/admin.service";
import { ToastService } from "app/services/toast.service";

@Component({
  selector: "delete-year-modal",
  templateUrl: "./delete-year-modal.component.html",
  styleUrls: ["./delete-year-modal.component.scss"],
})
export class DeleteYearModalComponent {
  @Input() profileId: number;

  @Input() currentYear: number;

  @Output() close = new EventEmitter<boolean>();

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  async deleteYear() {
    await this.adminService.deleteProfileYear(this.profileId, this.currentYear);
    this.close.emit(true);
    this.toastService.toast("Smazáno.", "notice");
  }
}
