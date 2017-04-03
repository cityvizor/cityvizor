import { Component, Input } from '@angular/core';

/*

Component for simple publishing of data

*/
@Component({
	moduleId: module.id,
	selector: 'data-catalogue',
	templateUrl: 'data-catalogue.template.html',
	styleUrls: []
})
export class DataCatalogueComponent{
	
	/* DATA */
	@Input()
	event;

}