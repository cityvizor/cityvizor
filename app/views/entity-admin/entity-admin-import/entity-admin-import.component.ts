import { Component, Input } from '@angular/core';

import { ToastService } 		from '../../../services/toast.service';
import { DataService } 		from '../../../services/data.service';

import { Module, MODULES } from "../../../shared/data/modules";

import { FileUploader, FileItem } from "ng2-file-upload";

@Component({
	moduleId: module.id,
	selector: 'entity-admin-import',
	templateUrl: 'entity-admin-import.template.html',
	styles: [],
})
export class EntityAdminImportComponent {

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
	upload;
	 
	 uploader;

	constructor(private _ds: DataService, private _toastService: ToastService) {
		this.modules = MODULES;
	}

	uploadExpenditures(){
		this.expendituresUploader.uploadAll();
	}
	 
	uploadEvents(){
		this.eventsUploader.uploadAll();
	}

}