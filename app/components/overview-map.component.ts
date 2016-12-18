import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'overview-map',
	templateUrl: 'overview-map.template.html',
	styles: [``]
})
export class OverviewMapComponent{

	@Input()
	labels: boolean;

	@Input()
	width: number;

	@Input()
	height: number;
	 
	@Input()
	search: string;
	 
	@Input()
	profiles: any[];

	mapSize = {"width": 973.53, "height":553.6};
	 
	@Output()
	openProfile = new EventEmitter<any>();

	/*
	50.251944, 12.091389 Z
	49.550278, 18.858889 V
	51.055556, 14.316111 S
	48.5525, 14.333056 J
	*/
	czechRepublicGPSBounds = {"lat": {"min":48.5525,"max":51.055556}, "lng":{"min":12.1008364,"max":18.8268292}};

	gps2mapLat (c) {
		return this.mapSize.height*(this.czechRepublicGPSBounds.lat.max-c)/(this.czechRepublicGPSBounds.lat.max-this.czechRepublicGPSBounds.lat.min);
	}
	gps2mapLng (c) {
		return this.mapSize.width*(c-this.czechRepublicGPSBounds.lng.min)/(this.czechRepublicGPSBounds.lng.max-this.czechRepublicGPSBounds.lng.min);
	}
	 
}