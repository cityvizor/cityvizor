import { Component, Input } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
	moduleId: module.id,
	selector: 'dash-board',
	templateUrl: 'dash-board.template.html',
	styleUrls: [],
})
export class DashboardComponent {

	@Input()
	entity: any;
	
	constructor(private sanitizer: DomSanitizer) {

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