import { Component, Input } from '@angular/core';

import { ToastService } 		from '../../../services/toast.service';
import { DataService } 		from '../../../services/data.service';

import { Module, MODULES } from "../../../shared/data/modules";

import { FileUploader, FileItem } from "ng2-file-upload";

@Component({
	moduleId: module.id,
	selector: 'profile-admin-import',
	templateUrl: 'profile-admin-import.template.html',
	styleUrls: ['profile-admin-import.style.css']
})
export class ProfileAdminImportComponent {

	@Input()
	set profile(profile){
		
		if(profile && profile._id){
			this.profileId = profile._id;
			this.expendituresUploader = this.dataService.getExpendituresUploader(profile._id,this.year);
			this.eventsUploader = this.dataService.getEventsUploader(profile._id);
			this.loadETLs();
		}
		else{
			this.expendituresUploader = null;
			this.eventsUploader = null;
		}
	}
	 
	profileId:string;
	 
	year:number;
	 
	etls:any[];
	 
	etlVisible:string;

	modules: Module[];
	 
	expendituresUploader:FileUploader;
	eventsUploader:FileUploader;
	 
	 statuses = {
		 "success": "úspěšně nahráno",
		 "error": "nastala chyba",
		 "pending": "probíhá import"
	 };
	 
	 targets = {
		 "expenditures": "výdaje",
		 "events": "investiční akce"
	 };

	constructor(private dataService: DataService, private _toastService: ToastService) {
		this.modules = MODULES;
		this.year = (new Date()).getFullYear();
	}

	uploadExpenditures(){
		this.expendituresUploader.queue[this.expendituresUploader.queue.length - 1].upload();
	}
	 
	uploadEvents(){
		this.eventsUploader.uploadAll();
	}
	 
	loadETLs(){
		this.dataService.getETLs({profile:this.profileId}) 
			.then(etls => this.etls = etls);
	}
	 
	 toggleETLVisible(etl){
		 if(this.etlVisible === etl._id) this.etlVisible = null;
		 else this.etlVisible = etl._id;
	 }

}