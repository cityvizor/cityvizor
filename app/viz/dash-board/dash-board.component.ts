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
			position: absolute; left: 5px; color:#fff; opacity:.8;
		}	
		.titleHoursEnd { 
			right: 5px; position: absolute; color:#fff;opacity:.8;
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
	
	days = ["mo","tu","we","th","fr","sa","su"];
	daysCZ = ["Po","Út","St","Čt","Pá","So","Ne"];
	
	hoursOpeningOptions = {
		"dayStart" : 7,
		"dayEnd" : 20,
		"padding" : 10
	};

	hour2string(hour){
		var parts = hour.split(":");
		if(parts[1] == "00") return parts[0];
		return hour;
	}

	hour2number(hour){
		var parts = hour.split(":");
		var number = Number(parts[0]) + (parts[1] ? Number(parts[1]) / 60 : 0);
		return number;
	}

	getBarMarginLeft (h) {
		h = this.hour2number(h);
		var o=this.hoursOpeningOptions;
		return o.padding + Math.round((100-2*o.padding)*(h-o.dayStart)/(o.dayEnd-o.dayStart));
	}
	getBarMarginRight (h) {
		h = this.hour2number(h);
		var o = this.hoursOpeningOptions;
		return o.padding + Math.round((100-2*o.padding)*(o.dayEnd-h)/(o.dayEnd-o.dayStart));
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