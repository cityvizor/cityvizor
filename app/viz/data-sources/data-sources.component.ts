import { Component, OnInit} from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'data-sources',
	templateUrl: 'data-sources.template.html',
	styleUrls: [],
})
export class DataSourcesComponent implements OnInit {

	dataSources = [];
	
	constructor(private route: ActivatedRoute) {

	}

	ngOnInit(){
		this.route.parent.params.forEach((params: Params) => {
			this.dataSources.push({name:"Přezkum hospodaření","url":"#"});
			this.dataSources.push({name:"Výdaje","url":"#"});
		});
	}

}