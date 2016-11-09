import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ToastService } 		from '../../services/toast.service';
import { DataService } 		from '../../services/data.service';

import { Module } from "../../shared/schema";
import { MODULES } from "../../shared/modules";


@Component({
	moduleId: module.id,
	selector: 'entity-admin',
	templateUrl: 'entity-admin.template.html',
	styles: [],
})
export class EntityAdminComponent implements OnInit {

	entity: any;	 

	view: string; 
	
	dataString: string = "";

	modules: Array<Module>;

	constructor(private _route: ActivatedRoute, private _router: Router, private _ds: DataService, private _toastService: ToastService) {

		this.modules = MODULES;

		this._route.params.forEach((params: Params) => {
			this.view = params["view"];
		});
		
		setInterval(() => this.refreshDataString(),100);
	}

	ngOnInit(){
		this._route.params.forEach((params: Params) => {
			this._ds.getEntity(params["ico"]).then(entity => {
				this.entity = entity;
			});
		});		
	}
	
	getModuleData(moduleId){
		if(!this.entity.data.modules[moduleId]) this.entity.data.modules[moduleId] = {};
		return this.entity.data.modules[moduleId];
	}

	refreshDataString(){
		this.dataString = JSON.stringify(this.entity,null,2);
	}
	
	getModuleLink(openModule){
		return ['../' + openModule.id];
	}
	
	getCloseLink(openModule){
		return ['/ico/' + this.entity.ico];
	}

	openConfig(adminModule){
		this._router.navigate([adminModule.id], { relativeTo: this._route });
	}

	closeConfig(){
		this._router.navigate(['../'], { relativeTo: this._route });
	}

}