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

  modes = [
    {display: "Nahradit stávající data", value: "overwrite"},
    {display: "Přidat k stávajícím datům", value: "append"}
  ]

  constructor(
    private importService: ImportService,
    private toastService: ToastService) { }

  ngOnInit() {

  }


  async uploadData(form: NgForm, dataFileInput: HTMLInputElement, eventsFileInput: HTMLInputElement, accountingFileInput: HTMLInputElement, paymentsFileInput: HTMLInputElement) {
    const fields: [HTMLInputElement, string, string, string][] = [
      [dataFileInput, "data", "dataFileMode", "Datový soubor nemá"],
      [eventsFileInput, "events", "eventsFileMode", "Číselník nemá"],
      [accountingFileInput, "accounting", "accountingFileMode", "Rozpočet nemá"],
      [paymentsFileInput, "payments", "paymentsFileMode", "Faktury nemají"]
    ]
    if (!this.year) {
      this.toastService.toast("Nezvolený rok", "notice") 
      return;
    }
    if (!fields.map(a => a[0]).some((e: HTMLInputElement) => e.files && e.files[0])) {
      this.toastService.toast("Žádné soubory nevybrány k nahrání", "error") 
      return;
    }

    const v = form.value
    const tasks: Promise<String>[] = []

    // Using for...of here so return actually returns (and doesn't just break, like it does in forEach)
    for (const [element, name, mode, error] of fields) {
      const data = new FormData()
      if (element.files && element.files[0]) {
        if (v[mode] == "") {
          this.toastService.toast(`${error} nastavený režim nahrání.`, "error")
          return
        }
        const file = element.files[0]
        data.set(name, file, file.name)
        data.set("year", String(this.year));
        data.set("validity", v.validity);
        
        switch(name) {
          case "payments":
            tasks.push(this.importService.importPayments(this.profileId, data, v[mode] == "append"))
            break
          case "accounting":
            tasks.push(this.importService.importAccounting(this.profileId, data, v[mode] == "append"))
            break
          case "events":
            tasks.push(this.importService.importEvents(this.profileId, data, v[mode] == "append"))
            break
          case "data":
            tasks.push(this.importService.importData(this.profileId, data, v[mode] == "append"))
            break
        }
      } 
    }

    await Promise.all(tasks).then(_ => {
      this.toastService.toast("Data nahrána pro import.", "notice")
    }).catch(e => {
      this.toastService.toast("Neočekáváná chyba při odesílání dat. Prosím, kontaktujte administrátora.", "error")
    });
    
    this.close.emit(true);
  }

}
