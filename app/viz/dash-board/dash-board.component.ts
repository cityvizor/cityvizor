import { Component, Input } from '@angular/core';

import { DataService } from '../../services/data.service';

@Component({
	moduleId: module.id,
	selector: 'dash-board',
	templateUrl: 'dash-board.template.html',
	styleUrls: ["dash-board.style.css"],
})
export class DashboardComponent {
	
	@Input()
	profile:any;
	
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
	 
	dashboardData = {
		"Years" : [2013, 2014, 2015, 2016],
		"Inc" : {
			"YearAmounts" : [2000000,3000000,2700000,3200000],
			"MaxYearAmount" : 3000000,
			"YearParts" : [
				[1000000,500000,200000,300000],
				[1200000,1300000,220000,280000],
				[1300000,1000000,200000,200000],
				[1500000,1200000,200000,300000]
			]
		},
		"Exp" : {
			"YearAmounts" : [1800000,2800000,2200000,3500000],
			"MaxYearAmount" : 3000000,
			"YearParts" : [
				[300000,1000000,500000],
				[600000,1200000,1000000],
				[400000,1000000,800000],
				[900000,1500000,1100000]
			]
		}
	}; 
	getMaxIncYearAmount () { return Math.max.apply(null, this.dashboardData.Inc.YearAmounts); }
	getMaxExpYearAmount () { return Math.max.apply(null, this.dashboardData.Exp.YearAmounts); }

	svgPointString (x,y) {
			return x + ' ' + y;
	}

	getExpSemicirclePath (sx,sy,r) {
		return "M"+(sx-r)+" "+sy+" A "+r+" "+r+",0,0,0,"+(sx+r)+" "+sy+" Z";
	}
	getIncSemicirclePath (sx,sy,r) {
		return "M"+(sx-r)+" "+sy+" A "+r+" "+r+",0,0,1,"+(sx+r)+" "+sy+" Z";
	}
	 
	 
	getExpTrianglePath (sx,sy,a2) {
		var Cx = [];
		Cx.push(this.svgPointString(sx,			sy+a2));
		Cx.push(this.svgPointString(sx+a2,	sy));
		
		return "M"+(sx-a2)+" "+sy+" L "+Cx.join(" L");
	}
	getIncTrianglePath (sx,sy,a2) {
		var Cx = [];
		Cx.push(this.svgPointString(sx,			sy-a2));
		Cx.push(this.svgPointString(sx+a2,	sy));
		
		return "M"+(sx-a2)+" "+sy+" L "+Cx.join(" L");
	}

	dashboard = {
		expenditures:[],
		income:[]
	};

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