import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';

import { DataService } from '../../services/data.service';
import { NoticeBoardService } from '../../services/notice-board.service';

@Component({
	moduleId: module.id,
	selector: 'notice-board',
	templateUrl: 'notice-board.template.html',
	styles: [``]
})
export class NoticeBoardComponent implements OnInit {
	
	entity;
	
	constructor(private route: ActivatedRoute, private _ds: DataService, private _nbs: NoticeBoardService) {

	}

	ngOnInit(){
		this.route.parent.params.forEach((params: Params) => {
			this._ds.getEntity(params['id'])
				.then(entity => this.entity = entity)
				.then(entity => this.loadList({},1));
		});
	}
	
	loadList(filter,page){		
		if(!this.entity["notice-board"]) return;
		
		this._nbs.getList(this.entity["notice-board"],filter,page).then(data => {
			console.log(data);
			return data;
			
		});
	}

}