import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { DataService } 		from '../../services/data.service';

//00006947
@Component({
	moduleId: module.id,
	selector: 'entity-view',
	templateUrl: 'entity-view.template.html',
	styleUrls: ['entity-view.style.css'],
})
export class EntityViewComponent implements OnInit {

	ico: string;
	view: string;
	
	entity = {
		"name": "",
		"ico": ""
	};
	
	
	
	year = 2016;

	constructor(private _route: ActivatedRoute, private _ds: DataService) {
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
	
	getMenuLink(view){
		return ['/ico/' + this.ico + '/' + view];
	}
}