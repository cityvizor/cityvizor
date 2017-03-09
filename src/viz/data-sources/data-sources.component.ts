import { Component } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'data-sources',
	templateUrl: 'data-sources.template.html',
	styles: [`
		* {opacity:inherit;}
	`],
})
export class DataSourcesComponent {

	dataSources = [];
	
	constructor(private route: ActivatedRoute) {

	}

}