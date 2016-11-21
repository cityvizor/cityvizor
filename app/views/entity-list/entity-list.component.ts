import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService} from '../../services/data.service';

@Component({
	moduleId: module.id,
	selector: 'entity-list',
	templateUrl: 'entity-list.template.html',
	styleUrls: ['entity-list.style.css']
})
export class EntityListComponent{
	
	show: string = "abc";
	
	letters = [];
	entities = [];
	
	type: string;

	mapSize = {"width": 1170, "height":665};

	/*
	50.251944, 12.091389 Z
	49.550278, 18.858889 V
	51.055556, 14.316111 S
	48.5525, 14.333056 J
	*/
	czechRepublicGPSBounds = {"lat": {"min":48.5525,"max":51.055556}, "lng":{"min":12.091389,"max":18.858889}};
	cities =	[
		{"ico": 215456, "name":"Nové Město na Moravě","gps":{"lat":49.561482,"lng":16.074221}}
	];
	
	@Input()
	set search(value: string){
		this._search = this.cleanString(value);	
	}

	_search: string;

	listColumns: number = 3;

	constructor(private _ds: DataService, private _router: Router) { }

	ngOnInit(){
		this._ds.getEntities({type:this.type}).then(entities => {
			this.entities = entities;
			this.makeList();
		});
	}

	gps2map (c, l) {
		var pos;
		if (l=="lat")	pos=this.mapSize.height*(this.czechRepublicGPSBounds.lat.max-c)/(this.czechRepublicGPSBounds.lat.max-this.czechRepublicGPSBounds.lat.min);
		else	pos=this.mapSize.width*(c-this.czechRepublicGPSBounds.lng.min)/(this.czechRepublicGPSBounds.lng.max-this.czechRepublicGPSBounds.lng.min);
		return pos;
	}

	makeList(){
		
		this.letters = [];
		
		this.entities.forEach((entity,i) => {
			var letter = entity.name.substring(0,1).toUpperCase();
			if(entity.name.substring(0,2).toUpperCase() === "CH") letter = "CH";
			if(!letter.match(/^\w+$/)) letter = "#";
			
			entity.searchString = this.cleanString(entity.name);
			
			var pushEntity = this.letters.some(item => {
				if(item.letter === letter) {
					item.entities.push(entity);
					return true;
				}
			});
			
			if(!pushEntity) this.letters.push({
				"letter": letter,
				entities: [entity]
			});
				
		});
	}

	cleanString(value: string){
		
		if(!value) return "";
		
		var sdiak="áäčďéěíĺľňóôőöŕšťúůűüýřžÁÄČĎÉĚÍĹĽŇÓÔŐÖŔŠŤÚŮŰÜÝŘŽ";
		var bdiak="aacdeeillnoooorstuuuuyrzAACDEEILLNOOOORSTUUUUYRZ";

		var output = "";

		for(var p = 0; p < value.length; p++){ 
			if(sdiak.indexOf(value.charAt(p)) !== -1) output += bdiak.charAt(sdiak.indexOf(value.charAt(p)));
			else output += value.charAt(p);
		}

		output = output.toLowerCase();

		return output;
	}

	openEntity(entity){
		this._router.navigate(['/ico',entity.ico]);
	}

	/*
	var mapEntities = angular.module('mapEntities', ['uiGmapgoogle-maps']);

	mapEntities.factory("Markers", function(){
		var Markers = [
			{
				"id": "0",
				"coords": {
					"latitude": "45.5200",
					"longitude": "-122.6819"
				},
				"window": {
					"title": "Portland, OR"
				}
			},
			{
				"id": "1",
				"coords": {
					"latitude": "40.7903",
					"longitude": "-73.9597"
				},
				"window" : {
					"title": "Manhattan New York, NY"
				}
			}
		];
		return Markers;
	});

	mapEntities.controller("gMap",function($scope,Markers){
		$scope.map = { 
			center: { latitude: 39.8282, longitude: -98.5795 }, 
			zoom: 4 
		};
		$scope.markers = Markers;
	});

	*/

}