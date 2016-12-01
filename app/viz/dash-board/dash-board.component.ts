import { Component, Input } from '@angular/core';

import { DataService } from '../../services/data.service';

@Component({
	moduleId: module.id,
	selector: 'dash-board',
	templateUrl: 'dash-board.template.html',
	styles: [],
})
export class DashboardComponent {

	_entity:any;

	dashboard = {
		expenditures:[],
		income:[]
	};

	@Input()
	set entity(entity: any){
		if(!entity) return;
		this._entity = entity;
		this._ds.getDashboard(entity.ico).then((dashboard) => this.dashboard = dashboard);
	}
	
	constructor(private _ds: DataService){
		
	}

	getIncBarWidth(){
		var n = this.dashboard.income.length;
		return (800 - (n - 1) * 50) / n;
	}

	getExpBarWidth(){
		var n = this.dashboard.expenditures.length;
		return (800 - (n - 1) * 50) / n;
	}
	/*
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
*/

}