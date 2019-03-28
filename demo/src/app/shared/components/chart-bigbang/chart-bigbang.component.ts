import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
	selector: 'chart-bigbang',
	templateUrl: 'chart-bigbang.component.html',
	styleUrls: ['chart-bigbang.component.scss']
})
export class ChartBigbangComponent {

	@Input() data:any;
	@Input() max:number;
	
	@Input() rotation:any = 0;

	@Input() selected: string;
	@Input() hovered: string;
	
	@Output() select = new EventEmitter<any>();	 
	@Output() hover = new EventEmitter<any>();
	 
	// the dimensions of the drawing	
	@Input() r: number = 500;
 	cx: number = 0;
 	cy: number = 0;
	alpha: number = 1/8; // default rotation of the chart
	innerR: number = 0.2; // relative to radius
	minR: number = 0.22; // relative to radius
	 
	@Input()
	height:number = 780;
	 
	constructor(){
	}
	 
	ngOnChanges(changes:SimpleChanges){
		if(changes.selected){
			this.updateAlpha(changes.selected);
		}
	}
	
	getStripeSize(amount){
		//console.log(amount,this.max,this.max ? Math.max(this.minR, Math.sqrt(amount / this.max * (1 - Math.pow(this.innerR,2)) + Math.pow(this.innerR,2))) : this.minR);
		return this.max ? Math.max(this.minR, Math.sqrt(amount / this.max * (1 - Math.pow(this.innerR,2)) + Math.pow(this.innerR,2))) : this.minR;
	}
	
	getCircleR(){
		return this.innerR * this.r * 0.9;
	}
	 
	// generate stripe by index, and inner and outer percentage size
	getStripePath(i,inner,outer){
		
		var innerRadius = inner * this.r;
		var outerRadius = outer * this.r;
		var size = this.data.length ? 1 / this.data.length : 0;
		var start = i / this.data.length;
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
	 
	updateAlpha(change){
		
		let prev = 0;
		this.data.some((item,i) => {
			if(item.id === change.previousValue){prev = i;return true;}
			else return false;
		});
		
		let next = 0;
		this.data.some((item,i) => {
			if(item.id === change.currentValue){next = i;return true;}
			else return false;
		});
		
		let diff = 0;
		
		if(Math.abs(next - prev) <= this.data.length / 2) diff = next - prev;
		else{
			if(prev > next) diff = next - prev + this.data.length;
			else diff = next - prev - this.data.length;
		}
		
		this.alpha += (-1) * diff * (1 / this.data.length);
			 
	}
}