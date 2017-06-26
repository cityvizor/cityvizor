import { Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

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

	@Input()
	profile:any;

	budgets:any[];
	 
	etls:Pager = new Pager();
	 
	etlVisible:string;

	statuses = {
		"success": "úspěšně nahráno",
		"error": "nastala chyba",
		"pending": "probíhá import"
	};
	 
	targets = {
		 "expenditures": "výdaje",
		 "events": "investiční akce"
	};
	 
	constructor(private dataService: DataService, private toastService: ToastService) {
	}

	ngOnChanges(changes:SimpleChanges){
		if(changes.profile){
			this.loadBudgets();
			//this.loadHistory(1);
		}
	}

	loadBudgets(){
		this.dataService.getProfileBudgets(this.profile._id)
			.then(budgets => this.budgets = budgets)
			.catch(err => this.toastService.toast("Nastala chyba při načítání přehledu nahraných dat.","error"));
	}
	 
	loadHistory(page){
		// dont load in case of invalida page numbers
		if(page > this.etls.pages || page < 1) return;
		
		let options = {
			profile: this.profile._id,
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

}