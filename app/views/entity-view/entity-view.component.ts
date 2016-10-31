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

	entity = {
		"name": "",
		"ico": ""
	};
	
	year = 2016;

	expenditureData;
	budgetData;

	constructor(private _route: ActivatedRoute, private _ds: DataService) {

	}


	ngOnInit(){
		this._route.params.forEach((params: Params) => {
			this._ds.getEntity(params['id']).then(entity => {
				this.entity = entity;
			});
		});		
	}
}