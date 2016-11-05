import { Component, Input } from '@angular/core';

import { NoticeBoardService } from '../../services/notice-board.service';

@Component({
	moduleId: module.id,
	selector: 'notice-board',
	templateUrl: 'notice-board.template.html',
	styles: [``]
})
export class NoticeBoardComponent {
	
	@Input()
	set nbId(value: number) {
		this.id = value;
		this.loadList({},1);
	}
	
	id: number;
	
	constructor(private _nbs: NoticeBoardService) {
		
	}
	
	loadList(filter,page){		
		if(!this.id) return;
		
		this._nbs.getList(this.id,filter,page).then(data => {
			console.log(data);
			return data;
		});
	}

}