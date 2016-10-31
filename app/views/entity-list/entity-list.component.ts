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

}