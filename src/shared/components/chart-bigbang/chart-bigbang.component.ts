import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { ChartGroups }  from "../../data/chartGroups";

@Component({
	moduleId: module.id,
	selector: 'chart-bigbang',
	templateUrl: 'chart-bigbang.template.html',
	styleUrls: ['chart-bigbang.style.css']
})
export class ChartBigbangComponent implements OnInit {

	@Input()
	set data(data){
		if(data){
			this._data = data;  // save the data
			if(this.initialized) this.setGroupData(); // if component is initialized, then run the animation
		}
	}
	 
	_data:any;

	@Input()
	selectedGroup: any;
	 
	@Input()
	hoveredGroup: any;
	
	@Input()
	scale: number = 1;
	
	@Output() selectGroup = new EventEmitter<any>();	 
	@Output() hoverGroup = new EventEmitter<any>();
	 
	// the dimensions of the drawing	
	r: number = 500;
 	cx: number = 500;
 	cy: number = 500;
	innerSize: number = 0.04;
	minSize: number = 0.008;
	showAmounts: boolean = true; // shows/hides budgetAmount and expenditureAmount in circle of vizualization
	showGroupTitles: boolean = true; // shows/hides budgetAmount and expenditureAmount in circle of vizualization
	
	// animation settings
	animationLength = 300; // length of the animation
	animationStep = 30; // how often should the animation update (value for setInterval)
	animationStart:number; // when did the animation started - used for computing the animation steps
	animationTimer; // used to store setInterval reference
	 
	initialized:boolean = false; //  used to save state so that we can check if component has been already initialized when we get new data

	// array with groups that vizualization is made of (fixed, does not vary with data)
	groups:any[] = [];
	 
	constructor(){
		this.groups = ChartGroups; 
		this.groups.forEach(group => {
			group.expenditureAmount = 0;
			group.budgetAmount = 0;
		});
	}

	ngOnInit(){
		this.initialized = true; // save state so that we can check if component has been already initialized when we get new data
		if(this._data && this._data.groups.length) this.setGroupData(); // if data is loaded at init time, launch the animation
	}
	 
	// set groups data - this launches the animation to set the data
	setGroupData(){
		
		// animation start time, used to calculate animation states
		this.animationStart = (new Date()).getTime();
		
		// if animation timer is running, we dont have to do anything, just reset the start time, but if not, we have to start the animation loop
		if(!this.animationTimer){
			this.animationTimer = setInterval(() => this.animationUpdate(),this.animationStep);
		}
		
		// we save previous amounts to determine the animation "path" 
		this.groups.forEach(group => {
			group.oldExpenditureAmount = group.expenditureAmount; 
			group.oldBudgetAmount = group.budgetAmount;
		});
	}
	 
	 
	// update chart to reflect change in time in animation
	animationUpdate(){
		
		if(!this._data) return;
		
		var groupData = this._data.groupIndex;
		
		// percentage is computed as position in time between start and end of animation
		var percentage = Math.min(1,((new Date()).getTime() - this.animationStart) / this.animationLength);
		// we want the percentage not to be linear with time, so we make start and end go faster using arc cos function
		percentage = Math.acos(1 - percentage * 2) / Math.PI;
		
		// if percentage reaches 1, we stop the animatin loop and set the destination values
		if(percentage >= 1){
			clearInterval(this.animationTimer);
			this.groups.forEach(group => {
				if(groupData[group.id]){
					group.expenditureAmount = groupData[group.id].expenditureAmount;
					group.budgetAmount = groupData[group.id].budgetAmount;
				}
			});
			return;
		}
		
		// if percentage is less than 1, we assign the temporary animation values
		this.groups.forEach(group => {
			if(groupData[group.id]){
				group.expenditureAmount = group.oldExpenditureAmount + (groupData[group.id].expenditureAmount - group.oldExpenditureAmount) * percentage;
				group.budgetAmount = group.oldBudgetAmount + (groupData[group.id].budgetAmount - group.oldBudgetAmount) * percentage;
			}
		});
		
	}

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

	 
	getCircleR(){
		return Math.sqrt(this.innerSize) * this.r;	 // area grows with square, so we use square root  (inner and outer are stil 0~1, but square root shape)
	}

	// generate path for group expenditures
	getEStripePath(i,group){
		var inner = this.innerSize;
		var outer = this.innerSize + this.minSize + (1 - this.minSize - this.innerSize) * (this._data.maxBudgetAmount ? group.expenditureAmount / this._data.maxBudgetAmount : 0);
		return this.getStripePath(i,inner,outer);
	}

	// generate path for group total budget minus expenditures
	getBStripePath(i,group){
		var inner = this.innerSize + this.minSize + (1 - this.minSize - this.innerSize) * (this._data.maxBudgetAmount ? group.expenditureAmount / this._data.maxBudgetAmount : 0);
		var outer = this.innerSize + this.minSize + (1 - this.minSize - this.innerSize) * (this._data.maxBudgetAmount ? group.budgetAmount / this._data.maxBudgetAmount : 0);
		return this.getStripePath(i,inner,outer);
	}

	// generate stripe by index, and inner and outer percentage size
	getStripePath(i,inner,outer){

		i = Math.min(Math.max(i,0),this.groups.length); // i ranges from 0 to number of groups

		var innerRadius = Math.sqrt(inner) * this.r; // we want the size to grow with area of the stripe, therefore square root (inner and outer are stil 0~1, but square root shape)
		var outerRadius = Math.sqrt(outer) * this.r;
		var start = this.groups.length ? i / this.groups.length : 0;
		var size = this.groups.length ? 1 / this.groups.length : 0;
		return this.generateStripePath(this.cx,this.cy,innerRadius,outerRadius,start,size);	
	}

	// generate SVG path attribute string for a donut stripe; start and size are percentage of whole
	generateStripePath(x,y,innerRadius,outerRadius,start,size){
		if(size >= 1) size = 0.9999; // if a stripe would be 100%, then it's circle, this is a hack to do it using this function instead of another
		
		innerRadius = Math.max(innerRadius,0); // inner size must be greater than 0
		outerRadius = Math.max(outerRadius,innerRadius); // outer size must be greater than inner
		size = Math.max(size,0); // size must be greater than 0
		if(size == 0 || size == 1) start = 0; // if a stripe is 0% or 100%, means it has to start at 0 angle 
		
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