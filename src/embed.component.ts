import { Component } from '@angular/core';

import { DataService } from './services/data.service';

import { AppConfig } from './config/app-config';

@Component({
	moduleId: module.id,
	selector: 'cityvizor-embed',
	templateUrl: 'embed.template.html',
	styleUrls: []
})
export class AppComponent {
	
	type:string = "large";

	constructor() {
	}


}