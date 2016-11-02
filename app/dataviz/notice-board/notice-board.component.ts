import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'notice-board',
	templateUrl: 'notice-board.template.html',
	styles: [``]
})
export class NoticeBoardComponent implements OnInit {
	
	ico: string;
	
	constructor(private route: ActivatedRoute) {

	}

	ngOnInit(){
		this.route.parent.params.forEach((params: Params) => {
			this.ico = params['id'];
		});
	}

}