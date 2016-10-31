import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer } from "@angular/platform-browser";

import { DataService } 		from '../../services/data.service';

@Component({
	moduleId: module.id,
	selector: 'entity-info',
	templateUrl: 'entity-info.template.html',
	styleUrls: [],
})
export class EntityInfoComponent implements OnInit {

	entity = {
		"name": "",
		"logo": "",
		"ico":"",
		"type":"",
		"coords": null
	};
	
	constructor(private route: ActivatedRoute, private _ds: DataService, private sanitizer: DomSanitizer) {

	}

	ngOnInit(){
		this.route.parent.params.forEach((params: Params) => {
			this._ds.getEntity(params['ico']).then(entity => {
				this.entity = entity;
			});
		});
	}
	
	getMapAddress(){
	
		var params = {
			"x":this.entity.coords.x * 1,
			"y":this.entity.coords.y * 1,
			"base":"1",
			"layers":[],
			"zoom":17,	
			"mark":{
				"x":this.entity.coords.x,
				"y":this.entity.coords.y,
				"title":this.entity.name
			},
			"overview":true
		};
		
		return this.sanitizer.bypassSecurityTrustResourceUrl("//api.mapy.cz/frame?width=500&height=333&params=" + encodeURIComponent(JSON.stringify(params)));
	}
}