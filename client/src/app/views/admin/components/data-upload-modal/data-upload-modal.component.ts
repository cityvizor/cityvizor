import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Profile, BudgetYear } from 'app/schema';
import { ImportService } from 'app/services/import.service';
import { ToastService } from 'app/services/toast.service';

@Component({
  selector: 'data-upload-modal',
  templateUrl: './data-upload-modal.component.html',
  styleUrls: ['./data-upload-modal.component.scss']
})
export class DataUploadModalComponent implements OnInit {

  @Input() year: number;
  @Input() profileId: number;

  @Output() close = new EventEmitter<boolean>();

  constructor(
    private importService: ImportService,
    private toastService: ToastService) { }

  ngOnInit() {

  }


  async uploadData(form, dataFileInput: HTMLInputElement, eventsFileInput: HTMLInputElement) {

    if (!dataFileInput.files || !dataFileInput.files[0]) {
      this.toastService.toast("Datový soubor je povinný.", "notice");
      return;
    }
    if (!this.year) return;

    const formData = form.value;
    const data = new FormData();

    data.set("year", String(this.year));

    data.set("validity", formData.validity);

    const file = dataFileInput.files[0]
    data.set("dataFile", file, file.name);

    if (eventsFileInput.files && eventsFileInput.files[0]) {
      const file = eventsFileInput.files[0]
      data.set("eventsFile", file, file.name);
    }

    await this.importService.importAccounting(this.profileId, data);

    this.close.emit(true);

  }

}
