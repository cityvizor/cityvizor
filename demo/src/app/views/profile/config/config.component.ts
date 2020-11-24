import { Component } from '@angular/core';

import { DataService } from "app/services/data.service";
@Component({
	selector: 'config',
	templateUrl: 'config.component.html',
	styleUrls: ['config.component.scss']
})
export class ConfigComponent {

	profile: any;

	constructor(private dataService: DataService) {
		this.dataService.getProfile(null).then(profile => this.profile = profile);
	}

}