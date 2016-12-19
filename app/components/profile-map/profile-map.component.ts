import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'profile-map',
	templateUrl: 'profile-map.template.html'
})
export class ProfileMapComponent{

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

	czechRepublicGPSBounds = {"lat": {"min":48.5525,"max":51.055556}, "lng":{"min":12.1008364,"max":18.8268292}};

	gps2mapLat (c) {
		return this.mapSize.height*(this.czechRepublicGPSBounds.lat.max-c)/(this.czechRepublicGPSBounds.lat.max-this.czechRepublicGPSBounds.lat.min);
	}
	gps2mapLng (c) {
		return this.mapSize.width*(c-this.czechRepublicGPSBounds.lng.min)/(this.czechRepublicGPSBounds.lng.max-this.czechRepublicGPSBounds.lng.min);
	}
	 
}