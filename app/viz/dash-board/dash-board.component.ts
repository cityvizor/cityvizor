import { Component, Input } from '@angular/core';

import { DataService } from '../../services/data.service';

@Component({
	moduleId: module.id,
	selector: 'dash-board',
	templateUrl: 'dash-board.template.html',
	styles: [`
		.barHoursOpened {
			height: 10px; background: red none repeat scroll 0% 0%; border-radius: 10px; margin: 0px 20%; position: relative;
		}	
		.titleHoursStart {
			position: absolute; left: -15px;
		}	
		.titleHoursEnd { 
			right: -15px; position: absolute;
		}
	`],
})
export class DashboardComponent {
	
	mapSize = {"width": 973, "height":553};

	dashboard = {
		expenditures:[],
		income:[]
	};

	@Input()
	profile:any;
	
	constructor(private _ds: DataService){
	}

	getIncBarWidth(){
		var n = this.dashboard.income.length;
		return (800 - (n - 1) * 50) / n;
	}

	getExpBarWidth(){
		var n = this.dashboard.expenditures.length;
		return (800 - (n - 1) * 50) / n;
	}

}