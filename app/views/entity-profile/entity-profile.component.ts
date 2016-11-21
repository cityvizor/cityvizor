import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { DataService } 		from '../../services/data.service';
import { Module } from "../../shared/schema";
import { MODULES } from "../../shared/modules";

//00006947
@Component({
	moduleId: module.id,
	selector: 'entity-profile',
	templateUrl: 'entity-profile.template.html',
	styleUrls: ['entity-profile.style.css'],
})
export class EntityProfileComponent implements OnInit {

	ico: string;
	view: string;
	
	entity: any;
	
	modules: Module[];
	
	year = 2016;

	constructor(private _route: ActivatedRoute, private _ds: DataService) {
		
		this.modules = MODULES;
		
		this._route.params.forEach((params: Params) => {
			this.ico = params["ico"];
			this.view = params["view"];
		});
	}


	ngOnInit(){
		this._route.params.forEach((params: Params) => {
			this._ds.getEntity(params["ico"]).then(entity => {
				this.entity = entity;
			});
		});		
	}
	
	getVizLink(viz){
		return ['/ico/' + this.ico + '/' + viz];
	}
	
	getAdminLink(){
		return ['/ico/' + this.ico + '/admin'];
	}
}