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
		"dayEnd" : 20
	};

 	payments = [];
	contracts = [];
	budgets = [];
	 
	maxBudgetAmount:number = 0;
	 
	maxExpenditureAmount:number = 0;
	maxIncomeAmount:number = 0;

	dashboard = {
		expenditures:[],
		income:[]
	};

	constructor(private dataService: DataService){
	}
	 
	ngOnInit(){
		this.dataService.getProfilePayments(this.profile._id,{limit:5,sort:"-date"})
			.then(payments => this.payments = payments)
		
		this.dataService.getProfileContracts(this.profile._id,{limit:5,sort:"-date"})
			.then(contracts => this.contracts = contracts)
		
		this.dataService.getProfileBudgets(this.profile._id,{limit:3,sort:"-year"})
			.then(budgets => this.budgets = budgets)
			.then(budgets => budgets.sort((a,b) => (a.year - b.year)))
			.then(budgets => {
				/*budgets.map(budget => this.maxExpenditureAmount = Math.max(this.maxExpenditureAmount,budget.expenditureAmount));
				budgets.map(budget => this.maxIncomeAmount = Math.max(this.maxIncomeAmount,budget.incomeAmount));*/
				this.maxBudgetAmount = 0;
				budgets.forEach(budget => this.maxBudgetAmount = Math.max(this.maxBudgetAmount,budget.budgetIncomeAmount,budget.incomeAmount,budget.budgetExpenditureAmount,budget.expenditureAmount));
			});
	}

	getIncBarWidth(){
		var n = this.dashboard.income.length;
		return (800 - (n - 1) * 50) / n;
	}

	getExpBarWidth(){
		var n = this.dashboard.expenditures.length;
		return (800 - (n - 1) * 50) / n;
	}
	 
	 
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

	getHoursBarLeft (hours) {
		// convert hours to number
		let from = this.hour2number(hours.from);
		
		// short for hoursOpeningOptions
		let options = this.hoursOpeningOptions;
		
		// compute left position
		return Math.round((from - options.dayStart) / (options.dayEnd - options.dayStart) * 100);
	}
	getHoursBarWidth (hours) {
		// convert hours to number
		let from = this.hour2number(hours.from);
		let to = this.hour2number(hours.to);
		
		// short for hoursOpeningOptions
		let options = this.hoursOpeningOptions;
		
		// compute width
		return Math.round((to - from) / (options.dayEnd - options.dayStart) * 100);
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
	 
	svgPointString (x,y) {
			return x + ' ' + y;
	}

	getXOffset(i) {
		return (i+1/2)*1000/this.budgets.length;
	}
	getExpSemicirclePath (budget,i) {
		var MAX_R = 90;
		var sx = this.getXOffset(i);
		var sy = 150;
		var r = MAX_R * (budget.expenditureAmount/Math.max(this.maxExpenditureAmount,this.maxIncomeAmount));
		return "M"+(sx-r)+" "+sy+" A "+r+" "+r+",0,0,0,"+(sx+r)+" "+sy+" Z";
	}
	getIncSemicirclePath (budget,i) {
		var MAX_R = 90;
		var sx = this.getXOffset(i);
		var sy = 150;
		var r = MAX_R * (budget.incomeAmount/Math.max(this.maxExpenditureAmount,this.maxIncomeAmount));
		return "M"+(sx-r)+" "+sy+" A "+r+" "+r+",0,0,1,"+(sx+r)+" "+sy+" Z";
	}
	getDiffSemicircleFill (budget,i) {
		if (budget.incomeAmount > budget.expenditureAmount)
			return "#ADF";
		if (budget.incomeAmount < budget.expenditureAmount)
			return "#FF9491";
	}
	getDiffSemicirclePath (budget,i) {
		var MAX_R = 90;
		var sx = this.getXOffset(i);
		var sy = 150;
		var rInc = MAX_R * (budget.incomeAmount / Math.max(this.maxExpenditureAmount,this.maxIncomeAmount));
		var rExp = MAX_R * (budget.expenditureAmount / Math.max(this.maxExpenditureAmount,this.maxIncomeAmount));
		
		var r1, r2, orientation;
		
		if (rInc>rExp) {
			r1 = rInc;
			r2 = rExp;
			orientation = 1;
		}
		else {
			r1 = rExp;
			r2 = rInc;
			orientation = 0;
		}
		if ((r1-r2)<3) r1=r1+(3-(r1-r2));
		
		return "M"+(sx-r1)+" "+sy+" A "+r1+" "+r1+",0,0,"+orientation+","+(sx+r1)+" "+sy+" L"+(sx+r2)+" "+sy+" A "+r2+" "+r2+",0,0,"+(orientation>0?"0":"1")+","+(sx-r2)+" "+sy+" Z";
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
	 

}
