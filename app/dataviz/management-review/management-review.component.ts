import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { DataService } 		from '../../services/data.service';

@Component({
	moduleId: module.id,
	selector: 'management-review',
	templateUrl: 'management-review.template.html',
	styleUrls: ['management-review.style.css'],
})
export class ManagementReviewComponent implements OnInit {

	constructor(private route: ActivatedRoute, private _ds: DataService) {

	}


	ngOnInit(){
		
	}
}