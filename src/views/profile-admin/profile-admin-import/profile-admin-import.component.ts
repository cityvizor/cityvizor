import { Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

import { ToastService } 		from '../../../services/toast.service';
import { DataService } 		from '../../../services/data.service';

import { Pager } from "../../../shared/schema/pager";

import { ModalDirective } from 'ngx-bootstrap/modal';

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
	
	@ViewChild('importModal') public importModal:ModalDirective;

	budgets:any[];
	 
	importResult:any;
	 
	etls:Pager = new Pager();
	 
	etlVisible:string;
	
	config:any = AppConfig;

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
	 
	showResult(success:boolean,year:number,result:any){
		if(result){
			this.importResult = {
				success: success,
				year: year,
				counter: success ? result.counter : null,
				warnings: success ? result.warnings : null,
				error: success ? null : result
			}
			this.importModal.show();
		}
		this.loadBudgets();
	}
	 
	createBudget(){
	
		var year = window.prompt("Zadejte rozpočtový rok:");
		
		if(!year) return;
		
		if(!year.match(/\d{4}/)) {
			this.toastService.toast("Datum musí být čtyři číslice.","notice");
			return;
		}
			
		this.budgets.push({
			profile: this.profile._id,
			year: year
		});
	}
	 
	toggleETLVisible(etl){
		if(this.etlVisible === etl._id) this.etlVisible = null;
		else this.etlVisible = etl._id;
	}

}