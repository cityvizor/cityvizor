import { Component, Input, ViewChild, AfterViewInit, OnDestroy, trigger, state, style, transition, animate } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'chart-donut',
	templateUrl: 'chart-donut.template.html',
	styleUrls: [],
	animations: [
		trigger('scrollAnimation', [
			state('hidden', style({
				opacity: 0,
				//transform: 'scale(0.5)'
			})),
			state('visible',   style({
				opacity: 1,
				//transform: 'scale(1)'
			})),
			transition('hidden => visible', animate('500ms ease-in-out'))
		])
	]
})
export class ChartDonutComponent implements AfterViewInit, OnDestroy {

	@Input() data:any;	
	 
	@ViewChild('donutchart') el;
	 
	visible:boolean;

	constructor(){
		window.addEventListener("scroll",this.updateVisible.bind(this))
	}
	 
	ngAfterViewInit(){
		// if we change value during ngAfterViewInit, we have to either tell Angular to run another
		// round of change detection, or we can change the value after ngAfterViewInit (by using setTimeout)
		// and Angular does change detection on its own.
		setTimeout(() => this.updateVisible(),0);
	}
	
	ngOnDestroy(){
		window.removeEventListener("scroll",this.updateVisible.bind(this));
	}
	 
	isVisible(el){
		return (el.getBoundingClientRect().top >= 0) && (el.getBoundingClientRect().bottom <= window.innerHeight);
	}
	 
	updateVisible(){
		if(this.isVisible(this.el.nativeElement)){
			this.visible = true;
			window.removeEventListener("scroll",this.updateVisible.bind(this));
		}
	} 
	

	// generate SVG path attribute string for a donut stripe; start and size are percentage of whole, i.e. 1 is full circle
	generateStripePath(x,y,innerRadius,outerRadius,start,size){
		if(size >= 1) size = 0.9999; // if a stripe would be 100%, then it's circle, this is a hack to do it using this function instead of another

		innerRadius = Math.max(innerRadius,0); // inner size must be greater than 0
		outerRadius = Math.max(outerRadius,innerRadius); // outer size must be greater than inner
		size = Math.max(size,0);
		if(size == 0 || size == 1) start = 0; // if a stripe is 0% or 100%, means it has to start at 0 angle 

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