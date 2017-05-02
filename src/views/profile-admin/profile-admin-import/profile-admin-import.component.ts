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
			
			this.expendituresUploader.onCompleteItem = this.afterUpload.bind(this);
			this.eventsUploader.onCompleteItem = this.afterUpload.bind(this);
				
			this.loadETLs();
		}
		else{
			this.expendituresUploader = null;
			this.eventsUploader = null;
		}
	}
	 
	profileId:string;
	 
	year:number;
	 
	etls:{docs:any[],page:number,pages:number,total:number,limit:number} = {docs:[],page:1,pages:1,total:0,limit:20};
	 
	latest:{expenditures:any,events:any} = {expenditures:null,events:null};
	 
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
		this.eventsUploader.queue[this.eventsUploader.queue.length - 1].upload();
	}
	 
	afterUpload(item,response){
		
		// convert response if needed - in current version of ng2-file-upload we have to do it but maybe in future versions they will fix it
		if(typeof response === "string") response = JSON.parse(response); 
		
		// put the new ETL record to the list
		this.etls.docs.unshift(response);
		this.etls.docs.pop();
		
		// reload ETL list in five seconds, import should be finished by that time
		setTimeout(() => this.loadETLs(),5000);
	}
	 
	loadETLs(){
		this.loadHistory(this.etls ? this.etls.page : 1);
		this.loadLatest();		
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
	 
	loadLatest(){
		this.dataService.getLatestETLs(this.profileId)
			.then(etls => this.latest = etls);
	}
	 
	toggleETLVisible(etl){
		if(this.etlVisible === etl._id) this.etlVisible = null;
		else this.etlVisible = etl._id;
	}

}