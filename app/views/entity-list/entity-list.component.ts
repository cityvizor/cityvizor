import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService} from '../../services/data.service';

@Component({
	moduleId: module.id,
	selector: 'entity-list',
	templateUrl: 'entity-list.template.html',
	styleUrls: ['entity-list.style.css']
})
export class EntityListComponent{
	
	show: string = 'abc';

	entities = [];
	list = [];
	
	type: string;

	listColumns: number = 3;

	constructor(private _route: ActivatedRoute, private _router: Router, private _ds: DataService) {
	}

	ngOnInit(){
		this._route.data.forEach(data => {
			this.type = data['type'];
			this._ds.getEntities({type:this.type}).then(entities => {
				this.entities = entities;
				this.makeList();
			});
		});
	}
	
	makeList(){
		
		this.list = [];
		for(var i = 0; i < this.listColumns; i++) this.list.push([]);
		
		if(!this.entities.length) return;
		
		var columnCount = Math.ceil(this.entities.length / this.listColumns);
		
		this.entities.forEach((entity,i) => {
			var column = Math.floor(i / columnCount);
			
			this.list[column].push(entity);
		});
		
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