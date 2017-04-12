import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { ChartGroups }  from "../../data/chartGroups";

@Component({
	moduleId: module.id,
	selector: 'chart-bigbang',
	templateUrl: 'chart-bigbang.template.html',
	styleUrls: ['chart-bigbang.style.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartBigbangComponent {

	@Input()
	set data(data:any){
		this.updateAmounts(data);
		this.updateStripes(data);
	}
	
	@Input() rotation:any = 0;

	@Input() selected: string;
	@Input() hovered: string;
	
	@Output() select = new EventEmitter<any>();	 
	@Output() hover = new EventEmitter<any>();
	 
	// the dimensions of the drawing	
	r: number = 500;
 	cx: number = 0;
 	cy: number = 0;
	alpha: number = 1/10; // default rotation of the chart
	innerR: number = 0.2; // relative to radius
	minR: number = 0.22; // relative to radius
	showAmounts: boolean = true; // shows/hides budgetAmount and expenditureAmount in circle of vizualization
	showGroupTitles: boolean = true; // shows/hides budgetAmount and expenditureAmount in circle of vizualization
	
	// maximum absolute dimension = max of maximum budget and maximum expenditures
	maxAmount:number = 0;
	totalBudgetAmount:number = 0;
	totalExpenditureAmount:number = 0;
	 
	// animation settings
	animationLength = 500; // length of the animation
	animationStart:number; // when did the animation started - used for computing the animation steps
	 
	stripes:any[] = [];
	 
	constructor(private ngZone: NgZone, private changeDetector: ChangeDetectorRef){
		
		var stripes = [];
		ChartGroups.forEach((group,i) => {
			stripes.push({
				id: group.id,
				innerSize: 0,
				outerSize: 0
			});
		});
		this.stripes = stripes;
		
	}
	 
	updateAmounts(data){
		
		var maxAmount = 0;
		var totalBudgetAmount = 0;
		var totalExpenditureAmount = 0;
		
		Object.keys(data).forEach(id => {
			let item = data[id];
			maxAmount = Math.max(maxAmount,item.budgetAmount,item.expenditureAmount);
			totalBudgetAmount += item.budgetAmount;
			totalExpenditureAmount += item.expenditureAmount;
		});
		
		this.maxAmount = maxAmount;
		this.totalBudgetAmount = totalBudgetAmount;
		this.totalExpenditureAmount = totalExpenditureAmount;
	}
	
	updateStripes(data){
		
		this.stripes.forEach((stripe,i) => {

			let id = stripe.id;

			stripe.innerSize = data[id] && this.maxAmount ? Math.max(this.minR, Math.sqrt(data[id].expenditureAmount / this.maxAmount * (1 - Math.pow(this.innerR,2)) + Math.pow(this.innerR,2))) : this.minR;
			stripe.outerSize = data[id] && this.maxAmount ? Math.max(this.minR, Math.sqrt(data[id].budgetAmount / this.maxAmount * (1 - Math.pow(this.innerR,2)) + Math.pow(this.innerR,2))) : this.minR;
		});
	}
	
	getCircleR(){
		return this.innerR * this.r * 0.9;
	}

	getAlpha(){
		var selectedAlpha = 0;
		
		this.stripes.some((stripe,i) => {
			if(stripe.id == this.selected) {selectedAlpha = i / this.stripes.length;return true;}
			return false;
		});
		
		return this.alpha - selectedAlpha;
	}
	 
/*
	getLineCircleCoordinates (i,c) {
		var tR = this.r*4/5;
		var arcRad = (2*Math.PI/this.groups.length)*(i+0.5);
		
		var x = Math.round(this.cx+tR*Math.sin(arcRad));
		var y = Math.round(this.cy-tR*Math.cos(arcRad));
		
		if (c=='x') return x; else return y;
	}

	getLinePath (i) {
		var tR = this.r*4/5;
		
		var arcRad = (2*Math.PI/this.groups.length)*(i+0.5);
		
		var x = Math.round(this.cx+tR*Math.sin(arcRad));
		var y = Math.round(this.cy-tR*Math.cos(arcRad));
		
		var p = [];
		p.push("M" + x + "," + y);
		p.push("L" + this.cx + "," + 20);
		p.push("L" + this.cx + "," + 0);
		//p.push("Z");

		return p.join(" ");	
	}
*/
	 
	// generate stripe by index, and inner and outer percentage size
	getStripePath(i,inner,outer){
		
		var innerRadius = inner * this.r;
		var outerRadius = outer * this.r;
		var size = this.stripes.length ? 1 / this.stripes.length : 0;
		var start = i / this.stripes.length;
		return this.getDonutPath(this.cx,this.cy,innerRadius,outerRadius,start,size);	
	}

	// generate SVG path attribute string for a donut stripe; start and size are percentage of whole
	getDonutPath(x,y,innerRadius,outerRadius,start,size){
		
		if(size >= 1) size = 0.9999; // if a stripe would be 100%, then it's circle, this is a hack to do it using this function instead of another
		
		innerRadius = Math.max(innerRadius,0); // inner size must be greater than 0
		outerRadius = Math.max(outerRadius,innerRadius); // outer size must be greater than inner
		size = Math.max(size,0); // size must be greater than 0
		//if(size == 0 || size == 1) start = 0; // if a stripe is 0% or 100%, means it has to start at 0 angle 
		
		// the following fomulas come from analytic geometry and SVG path specification
		var startAngle = 2 * Math.PI * start;
		var angle =  2 * Math.PI * size;

		var startX1 = x + Math.sin(startAngle) * outerRadius;
		var startY1 = y - Math.cos(startAngle) * outerRadius;
		var endX1 = x + Math.sin(startAngle + angle) * outerRadius;
		var endY1 = y - Math.cos(startAngle + angle) * outerRadius;

		var startX2 = x + Math.sin(startAngle + angle) * innerRadius;
		var startY2 = y - Math.cos(startAngle + angle) * innerRadius;
		var endX2 = x + Math.sin(startAngle) * innerRadius;
		var endY2 = y - Math.cos(startAngle) * innerRadius;

		var outerArc = (size > 0.5 ? 1 : 0); // decides which way will the arc go

		var properties = [];
		properties.push("M" + startX1 + "," + startY1);
		properties.push("A" + outerRadius + "," + outerRadius + " 0 " + outerArc + ",1 " + endX1 + "," + endY1);
		properties.push("L" + startX2 + "," + startY2);
		properties.push("A" + innerRadius + "," + innerRadius + " 0 " + outerArc + ",0 " + endX2 + "," + endY2);
		properties.push("Z");

		return properties.join(" ");	
	}
}