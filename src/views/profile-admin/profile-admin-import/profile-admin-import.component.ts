import { Component, Input, ViewChild } from '@angular/core';

import { ToastService } 		from '../../../services/toast.service';
import { DataService } 		from '../../../services/data.service';

import { Module, MODULES } from "../../../shared/data/modules";
import { Pager } from "../../../shared/schema/pager";

import { FileUploader, FileItem } from "ng2-file-upload";

import { AppConfig } from '../../../config/app-config';

@Component({
	moduleId: module.id,
	selector: 'profile-admin-import',
	templateUrl: 'profile-admin-import.template.html',
	styleUrls: ['profile-admin-import.style.css']
})
export class ProfileAdminImportComponent {

	appConfig:any = AppConfig;

	@ViewChild('eventsFile') eventsFile;
	@ViewChild('expendituresFile') expendituresFile;
	
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
	}

	submitForm(form){
		
		let eventsFile = this.eventsFile.nativeElement.files[0];
		let expendituresFile = this.expendituresFile.nativeElement.files[0];
		
		if(!form.valid || !eventsFile || !expendituresFile){
			this.toastService.toast("Formulář není správně vyplněn.","error");
			return;
		}
		
		let formData: FormData = new FormData();
		
		let data = form.value;
		
		formData.set("profile",this.profileId);
		formData.set("year",data.year);
		formData.set("validity",data.validity);
		formData.set("note",data.note);
		
		console.log(data,eventsFile,expendituresFile);
		
		formData.set("eventsFile",eventsFile,eventsFile.name);
		formData.set("expendituresFile",expendituresFile,expendituresFile.name);
			 
		console.log(formData);
		
		this.dataService.importExpenditures(formData);
				
		return false;
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