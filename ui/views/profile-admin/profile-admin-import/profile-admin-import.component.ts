import { Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

import { ToastService } 		from '../../../services/toast.service';
import { DataService } 		from '../../../services/data.service';

import { Pager } from "../../../shared/schema/pager";
import { ETL, ETLLog } from "../../../shared/schema/etl";

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { AppConfig } from '../../../config/app-config';

@Component({
	moduleId: module.id,
	selector: 'profile-admin-import',
	templateUrl: 'profile-admin-import.template.html',
	styleUrls: ['profile-admin-import.style.css']
})
export class ProfileAdminImportComponent implements OnChanges {

	@Input()
	profile:any;
	
	modalRef: BsModalRef;

	etls:ETL[] = [];
	
	history:{ etl:ETL, etllogs:ETLLog[], pager:Pager } = { etl: new ETL(), etllogs: [], pager: new Pager() };
	settings:{etl:ETL} = {etl: new ETL()};
	upload:{etl:ETL, today:Date} = {etl: new ETL(), today: new Date()};
	delete:{etl:ETL, type:string} = {etl: new ETL(), type: "truncate"};
	
	importResult:any;
	
	config:any = AppConfig;

	loading:boolean = false;
	
	constructor(private dataService: DataService, private toastService: ToastService,  private modalService: BsModalService) {
	}
	

	ngOnChanges(changes:SimpleChanges){
		if(changes.profile){
			this.loadETLs();
		}
	}
	

	/* MAIN PAGE */
	loadETLs(){
		this.loading = true;
		this.dataService.getProfileETLs(this.profile._id, {sort: "year"})
			.then(etls => (this.etls = etls, this.loading = false))
			.catch(err => (this.toastService.toast("Nastala chyba při načítání přehledu importů: " + err.message,"error"), this.loading = false));
	}
	
	setVisible(etl,visible){
		var old_visible = etl.visible;
		etl.visible = visible;
		
		this.dataService.saveProfileETL(this.profile._id,etl._id,{"visible":visible})
			.then(() => this.toastService.toast(visible ? "Rozpočtový rok je viditelný" : "Rozpočtový rok je skrytý","notice"))
			.catch(err => {
				etl.visible = old_visible;
				this.toastService.toast("Chyba: " + err.message,"error");
			});
	}
	
	setAutoImport(etl,enabled){
		var old_enabled = etl.enabled;
		etl.enabled = enabled;
		
		this.dataService.saveProfileETL(this.profile._id,etl._id,{"enabled":enabled})
			.then(() => this.toastService.toast(enabled ? "Automatický import je zapnutý" : "Automatický import je vypnutý","notice"))
			.catch(err => {
				etl.enabled = old_enabled;
				this.toastService.toast("Chyba: " + err.message,"error");
			});
	}
		
	createETL(){
		
		var year = Number(window.prompt("Zadejte rozpočtový rok:"));
		
		if(!year) return;
		
		this.dataService.createProfileETL(this.profile._id,{year:Number(year)})
			.then(etl => {
				this.etls.push(etl);
				this.toastService.toast("Rozpočtový rok vytvořen.","notice");
			});
	}
	
	startImport(etl,event){
		
		if(etl.status === "pending" && !event.shiftKey){
			this.toastService.toast("Automatický import právě probíhá.","notice");
			return;
		}
		
		this.dataService.startProfileImport(this.profile._id,etl._id)
			.then(() => {
				etl.status = "pending";
				this.toastService.toast("Automatický import zahájen, pro zjištění stavu klikněte na odkaz \"obnovit\".","notice");
			})
			.catch(err => this.toastService.toast("Nastala chyba při zahajování automatického importu","error"));
	}
	
	/* HISTORY POPUP */
	openHistory(etl:ETL,popup){
		
		this.history = {
			etl: etl,
			etllogs: [],
			pager: new Pager()
		};
		
		this.loadHistory(etl);
    this.modalRef = this.modalService.show(popup, { class: "modal-lg" });
  }
	
	loadHistory(etl:ETL,page?){
	
		
		
		return this.dataService.getProfileETLLogs(this.profile._id,etl._id,{sort:"-timestamp", limit:10,page:page || 1})
			.then(etllogs => {
				this.history.pager = new Pager();
				let pager = this.history.pager;
				pager.page = etllogs.page;
				pager.total = etllogs.total;
				for(let i = 1; i <= etllogs.pages; i++) pager.pages.push(i);
			
				this.history.etllogs = etllogs.docs;
			})
			.catch(err => this.toastService.toast("Nastala chyba při stahování historie.","error"));
	}
	
	/* UPLOAD POPUP */
	openUpload(etl:ETL,popup){
		this.upload.etl = etl;
		this.modalRef = this.modalService.show(popup);
	}
	
	/* SETTINGS POPUP */
	openSettings(etl:ETL,popup){
		this.settings = {etl: etl};
		this.modalRef = this.modalService.show(popup);
	}
	saveSettings(etl,form){
		
		if(!form.valid){
			this.toastService.toast("Chybně vyplněná pole.","error");
			return;
		}
		
		var data = form.value;
		
		this.dataService.saveProfileETL(this.profile._id,this.settings.etl._id,data)
			.then(etl_new => {
				Object.assign(etl,etl_new);
				this.modalRef.hide();
				this.toastService.toast("Uloženo.","notice");
			})
			.catch(err => this.toastService.toast("Chyba: " + err.message,"error"));
	}
	
	/* DELETE POPUP */
	openDelete(etl:ETL,popup){
		this.delete = {etl: etl, type: "truncate"};
		this.modalRef = this.modalService.show(popup);
	}

	deleteETL(etl){
		this.dataService.deleteProfileETL(this.profile._id,etl._id,{type: this.delete.type})
			.then(() => {
				this.modalRef.hide();
				this.toastService.toast("Smazáno.","notice");
				this.loadETLs();
			})
			.catch(err => this.toastService.toast("Chyba: " + err.message,"error"));
	}
	
	import(etl,dataFile,eventsFile,form){
		
		dataFile = dataFile.files[0];
		eventsFile = eventsFile.files[0];
		
		if(!dataFile || (etl.importer === "cityvizor-v1" && !eventsFile) || !form.valid){
			this.toastService.toast("Formulář není správně vyplněn.","error");
			return;
		}
		
		let formData: FormData = new FormData();
		
		let data = form.value;
		
		formData.set("validity",data.validity);
		formData.set("dataFile",dataFile,dataFile.name);
		if(etl.importer === "cityvizor-v1") formData.set("eventsFile",eventsFile,eventsFile.name);
		
		this.dataService.uploadProfileImport(this.profile._id,etl._id,formData)
			.then(() => {
				this.toastService.toast("Data byla nahrána na server, nyní jsou zpracovávána.", "notice");
				etl.status = "pending";
				this.modalRef.hide();
			})
			.catch(err => this.toastService.toast("Nastala chyba při nahrávání dat: " + err.message,"error"));
		
	}
}