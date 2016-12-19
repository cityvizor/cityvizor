import { Component, Input } from '@angular/core';

import { DataService } from '../../services/data.service';

@Component({
	moduleId: module.id,
	selector: 'dash-board',
	templateUrl: 'dash-board.template.html',
	styles: [`
		.rowHours {
	    font-size: 0.8em;
    	line-height: 1em;
    	margin-bottom: .5em;
		}
		.barHours {
			height: 1em; background: #f3f3f3; border-radius: 10px; margin: 0px 0%;
		}	
		.barHoursOpened {
			background: #2581C4; border-radius: 1.5em; margin: 0px 20%; position: relative;height: 100%;
		}	
		.titleHoursStart {
			position: absolute; left: -15px;
		}	
		.titleHoursEnd { 
			right: -15px; position: absolute;
		}
		.dayTitle {
			font-weight: bold;
		}
		profile-map {
			width: 100%; height: auto;
		}
	`],
})
export class DashboardComponent {
	
	hoursOpeningNMNM = [
		{"dayTitle":"Po", "start":8, "end":17},
		{"dayTitle":"Út", "start":0, "end":0},
		{"dayTitle":"St", "start":8, "end":17},
		{"dayTitle":"Čt", "start":8, "end":14},
		{"dayTitle":"Pá", "start":0, "end":0},
		{"dayTitle":"So", "start":0, "end":0},
		{"dayTitle":"Ne", "start":0, "end":0}
	];
	hoursOpeningOptions = {
		"dayStart" : 7,
		"dayEnd" : 20,
		"padding" : 10
	};

	getBarMarginLeft (h) {
		var o=this.hoursOpeningOptions;
		return o.padding + Math.round((100-2*o.padding)*(h.start-o.dayStart)/(o.dayEnd-o.dayStart));
	}
	getBarMarginRight (h) {
		var o=this.hoursOpeningOptions;
		return o.padding + Math.round((100-2*o.padding)*(o.dayEnd-h.end)/(o.dayEnd-o.dayStart));
	}

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