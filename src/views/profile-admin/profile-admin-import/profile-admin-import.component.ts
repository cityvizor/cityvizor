import { Component, Input } from '@angular/core';

import { ToastService } 		from '../../../services/toast.service';
import { DataService } 		from '../../../services/data.service';

import { Module, MODULES } from "../../../shared/data/modules";
import { Pager } from "../../../shared/schema/pager";

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
			this.loadHistory(1);
		}
	}
	 
	profileId:string;
	 
	etls:Pager = new Pager();
	 
	latest:{expenditures:any,events:any} = {expenditures:null,events:null};
	 
	etlVisible:string;

	modules: Module[] = MODULES;
	 
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
	 
	today:Date = new Date();

	constructor(private dataService: DataService, private toastService: ToastService) {
		this.expendituresUploader = this.dataService.getExpendituresUploader();
		this.eventsUploader = this.dataService.getEventsUploader();

		this.expendituresUploader.onCompleteItem = this.afterUpload.bind(this);
		this.eventsUploader.onCompleteItem = this.afterUpload.bind(this);
	}

	uploadExpenditures(form){
		
		if(!form.valid){
			this.toastService.toast("error","Formulář není správně vyplněn.");
			return;
		}
			 
		let data = form.value;
		
		this.expendituresUploader.options.additionalParameter = {
			profile: this.profileId,
			year: data.year,
			valid: data.valid,
			note: data.note
		};
		
		this.expendituresUploader.queue[this.expendituresUploader.queue.length - 1].upload();
	}
	 
	uploadEvents(form){
		
		if(!form.valid){
			this.toastService.toast("error","Formulář není správně vyplněn.");
			return;
		}
			 
		let data = form.value;
		
		this.eventsUploader.options.additionalParameter = {
			profile: this.profileId,
			valid: data.valid,
			note: data.note
		};
		
		this.eventsUploader.queue[this.eventsUploader.queue.length - 1].upload();
	}
	 
	afterUpload(item,response){
		
		// convert response if needed - in current version of ng2-file-upload we have to do it but maybe in future versions they will fix it
		if(typeof response === "string") response = JSON.parse(response); 
		
		// put the new ETL record to the list
		this.etls.docs.unshift(response);
		this.etls.docs.pop();
		
		// reload ETL list in five seconds, import should be finished by that time
		setTimeout(() => this.loadHistory(1),5000);
	}
	 
	loadHistory(page){
		// dont load in case of invalida page numbers
		if(page > this.etls.pages || page < 1) return;
		
		let options = {
			profile: this.profileId,
			page: page,
			sort: "-date"
		};
		
		this.dataService.getETLs(options)
			.then(etls => this.etls = etls);
	}
	 
	toggleETLVisible(etl){
		if(this.etlVisible === etl._id) this.etlVisible = null;
		else this.etlVisible = etl._id;
	}
	 
	getCurrentDate(){
		return new Date();
	}
	 
	getCurrentYear(){
		return this.getCurrentDate().getFullYear();
	}

}