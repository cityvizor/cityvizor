import { Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';

import { ToastService } 		from '../../../services/toast.service';
import { DataService } 		from '../../../services/data.service';

import { FileUploader, FileItem } from "ng2-file-upload";

import { AppConfig } from '../../../config/app-config';

@Component({
	moduleId: module.id,
	selector: 'profile-admin-import-box',
	templateUrl: 'profile-admin-import-box.template.html',
	styleUrls: ['profile-admin-import-box.style.css']
})
export class ProfileAdminImportBoxComponent {

	appConfig:any = AppConfig;

	@ViewChild('eventsFile') eventsFile;
	@ViewChild('expendituresFile') expendituresFile;
	
	@Input() profile:any;

	@Input() budget:any;

	@Output() saved:EventEmitter<any> = new EventEmitter();
	
	today:Date = new Date();

	editState:boolean = false;
	deleteState:boolean = false;

	constructor(private dataService: DataService, private toastService: ToastService) {
	}

	importData(form){
		
		let eventsFile = this.eventsFile.nativeElement.files[0];
		let expendituresFile = this.expendituresFile.nativeElement.files[0];
		
		if(!form.valid || !eventsFile || !expendituresFile){
			this.toastService.toast("Formulář není správně vyplněn.","error");
			return;
		}
		
		let formData: FormData = new FormData();
		
		let data = form.value;
		
		formData.set("profile",this.profile._id);
		formData.set("year",this.budget.year);
		formData.set("validity",data.validity);
		formData.set("note",data.note);
		
		console.log(data,eventsFile,expendituresFile);
		
		formData.set("eventsFile",eventsFile,eventsFile.name);
		formData.set("expendituresFile",expendituresFile,expendituresFile.name);
			 
		console.log(formData);
		
		this.dataService.importExpenditures(formData)
			.then(result => this.saved.emit(result));
				
		return false;
	}

	deleteData(form){
		if(form.value.confirmation){
			this.dataService.deleteProfileBudget(this.profile._id,this.budget.year)
				.then(() => this.saved.emit());
		}
		else this.toastService.toast("Musíte zaškrtnout pole.","notice")
																 
		return false;
	}

}