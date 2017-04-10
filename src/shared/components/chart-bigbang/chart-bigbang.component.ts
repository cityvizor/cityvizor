import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { ChartGroups }  from "../../data/chartGroups";

@Component({
	moduleId: module.id,
	selector: 'chart-bigbang',
	templateUrl: 'chart-bigbang.template.html',
	styleUrls: ['chart-bigbang.style.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartBigbangComponent implements OnInit, OnChanges {

	@Input() data:any;
	@Input() rotation:any = 0;

	@Input() selected: string;
	@Input() hovered: string;
	
	@Output() select = new EventEmitter<any>();	 
	@Output() hover = new EventEmitter<any>();
	 
	// the dimensions of the drawing	
	r: number = 500;
 	cx: number = 500;
 	cy: number = 500;
	alpha: number = 1/6; // default rotation of the chart
	innerR: number = 0.2; // relative to radius
	minR: number = 0.22; // relative to radius
	showAmounts: boolean = true; // shows/hides budgetAmount and expenditureAmount in circle of vizualization
	showGroupTitles: boolean = true; // shows/hides budgetAmount and expenditureAmount in circle of vizualization
	
	// maximum absolute dimension = max of maximum budget and maximum expenditures
	maxAmount:number = 0;
	
	// rotation due to selected group
	selectedAlpha:number = 0
	
	// animation settings
	animationLength = 500; // length of the animation
	animationStart:number; // when did the animation started - used for computing the animation steps
	 
	stripes:any[] = [];
	 
	constructor(private ngZone: NgZone, private changeDetector: ChangeDetectorRef){
		
		var stripes = [];
		ChartGroups.forEach((group,i) => {
			stripes.push({
				id: group.id,
				start: i / ChartGroups.length + this.alpha,
				innerSize: 0,
				outerSize: 0
			});
		});
		this.stripes = stripes;
		
	}

	ngOnInit(){
		
	}
	 
	ngOnChanges(changes: { [propName: string]: SimpleChange }) {
		console.log(changes);
		
		if(changes.data || changes.selected){
			this.updateMaxAmount();
			this.updateAlpha();
			this.animateChanges();
		}
	}
	 
	updateMaxAmount(){
		
		var maxAmount = 0;
		
		Object.keys(this.data).forEach(id => maxAmount = Math.max(maxAmount,this.data[id].budgetAmount,this.data[id].expenditureAmount));
		
		this.maxAmount = maxAmount;
	}
	
	updateAlpha(){
		var selectedAlpha = 0;
		this.stripes.some((stripe,i) => {
			if(stripe.id == this.selected) {selectedAlpha = i;return true;}
			return false;
		});
		
		// take the shorter turn:
		while(selectedAlpha - this.selectedAlpha > this.stripes.length / 2) selectedAlpha -= this.stripes.length;
		while(this.selectedAlpha - selectedAlpha > this.stripes.length / 2) selectedAlpha += this.stripes.length;
		
		//assign the value
		this.selectedAlpha = selectedAlpha;
	}

	animateChanges(){

		this.stripes.forEach((stripe,i) => {
			// save values for animation
			stripe.startSrc = stripe.start;
			stripe.innerSizeSrc = stripe.innerSize;
			stripe.outerSizeSrc = stripe.outerSize;

			let id = stripe.id;

			stripe.startTgt = (i - this.selectedAlpha) / ChartGroups.length;
			
			stripe.innerSizeTgt = this.data[id] && this.maxAmount ? Math.max(this.minR, Math.sqrt(this.data[id].expenditureAmount / this.maxAmount * (1 - Math.pow(this.innerR,2)) + Math.pow(this.innerR,2))) : this.minR;
			stripe.outerSizeTgt = this.data[id] && this.maxAmount ? Math.max(this.minR, Math.sqrt(this.data[id].budgetAmount / this.maxAmount * (1 - Math.pow(this.innerR,2)) + Math.pow(this.innerR,2))) : this.minR;
		});
		
		this.animationStart = (new Date()).getTime();
		
		this.animationLoop();
	}
	 
	animationStepValue(percentage,src,tgt){
		return (1 - percentage) * src + percentage * tgt;
	}
	
	animationLoop(){

		var percentage = ((new Date()).getTime() - this.animationStart) / this.animationLength;
		
		if(this.animationStart && percentage <= 1){
			
			percentage = (Math.sin((percentage - 0.5) * Math.PI) + 1) / 2;
			
			console.log(percentage);

			this.stripes.forEach((stripe,i) => {
				stripe.start = this.animationStepValue(percentage,stripe.startSrc,stripe.startTgt);
				stripe.innerSize = this.animationStepValue(percentage,stripe.innerSizeSrc,stripe.innerSizeTgt);
				stripe.outerSize = this.animationStepValue(percentage,stripe.outerSizeSrc,stripe.outerSizeTgt);
			});
			
			this.changeDetector.markForCheck();

			// go to next animation window
			requestAnimationFrame(this.animationLoop.bind(this));
		}
		else {
			this.stripes.forEach((stripe,i) => {
				stripe.start = stripe.startTgt;
				stripe.innerSize = stripe.innerSizeTgt;
				stripe.outerSize = stripe.outerSizeTgt;
			});
			this.changeDetector.markForCheck();
		}
	}
	
	getCircleR(){
		return this.innerR * this.r;
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
	getStripePath(start,inner,outer){
		var innerRadius = inner * this.r;
		var outerRadius = outer * this.r;
		var size = this.stripes.length ? 1 / this.stripes.length : 0;
		return this.getDonutPath(this.cx,this.cy,innerRadius,outerRadius,start,size);	
	}

	// generate SVG path attribute string for a donut stripe; start and size are percentage of whole
	getDonutPath(x,y,innerRadius,outerRadius,start,size){
		
		// rotate the chart by fixed angle
		start = start + this.alpha;
		
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