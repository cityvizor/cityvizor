import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AdminService } from "app/services/admin.service";
import { BudgetYear } from "../../../../schema";

@Component({
  selector: "add-modify-year-modal",
  templateUrl: "./add-modify-year-modal.component.html",
  styleUrls: ["./add-modify-year-modal.component.scss"]
})
export class AddModifyYearModalComponent implements OnInit {
  @Input() profileId: number;
  @Input() year: BudgetYear = {} as BudgetYear;

  @Output() close = new EventEmitter<boolean>();

  importFormats: Array<{ value: string; label: string }> = [
    { value: "cityvizor", label: "CityVizor CSV (ZIP)" },
    { value: "internetstream", label: "Internet Stream CSV (ZIP)" },
  ];

  isUpdate: boolean = false;

  buttonText: string = "Vytvořit";

  titleText: string = "Vytvořit nový rozpočtový rok";

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    if (this.year && this.year.year > 1900) {
      this.isUpdate = true;
      this.buttonText = "Uložit";
      this.titleText = "Upravit rozpočtový rok";
    } else {
      this.year = {
        year: new Date().getFullYear() + 1,
        hidden: true,
      } as BudgetYear;
    }
  }

  async addModifyYear(form: NgForm): Promise<void> {
    this.year.importFormat = form.value.import_format;
    this.year.importPeriodMinutes = Math.floor(Number(form.value.import_period_minutes));
    this.year.importUrl = form.value.import_url;

    if (!this.isUpdate) {
      await this.adminService.createProfileYear(
        this.profileId,
        form.value.year,
        this.year,
      );
    } else {
      await this.adminService.updateProfileYear(
        this.profileId,
        this.year.year,
        this.year
      );
    }
    form.reset()
    this.close.emit(true);
  }
}
