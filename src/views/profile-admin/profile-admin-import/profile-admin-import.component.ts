import { Component, Input } from '@angular/core';

import { ToastService } 		from '../../../services/toast.service';
import { DataService } 		from '../../../services/data.service';

import { Module, MODULES } from "../../../shared/data/modules";

import { FileUploader, FileItem } from "ng2-file-upload";

@Component({
	moduleId: module.id,
	selector: 'profile-admin-import',
	templateUrl: 'profile-admin-import.template.html',
	styles: [],
})
export class ProfileAdminImportComponent {

	@Input()
	set profile(profile){
		
		if(profile && profile._id){
			this.expendituresUploader = this._ds.getExpendituresUploader(profile._id,this.year);
			this.eventsUploader = this._ds.getEventsUploader(profile._id);
		}
		else{
			this.expendituresUploader = null;
			this.eventsUploader = null;
		}
	}
	 
	year:number;

	modules: Module[];
	 
	expendituresUploader:FileUploader;
	eventsUploader:FileUploader;

	constructor(private _ds: DataService, private _toastService: ToastService) {
		this.modules = MODULES;
		this.year = (new Date()).getFullYear();
	}

	uploadExpenditures(){
		this.expendituresUploader.queue[this.expendituresUploader.queue.length - 1].upload();
	}
	 
	uploadEvents(){
		this.eventsUploader.uploadAll();
	}

}