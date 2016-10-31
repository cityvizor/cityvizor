import { Component, Input, ViewChild, ElementRef } from '@angular/core';

import { Subject, BehaviorSubject } from 'rxjs/Rx';

@Component({
	moduleId: module.id,
	selector: 'expenditure-viz',
	templateUrl: 'expenditure-viz.template.html',
	styles: [`
		.circle{width:100px;height:100px;border-radius:50px;background-color:#09f;}
		.bgstripe{opacity:0;}
		.bgstripe:hover, .bgstripe.active{opacity:0.2;}
	`]
})
export class ExpenditureVizComponent{
	
	chartData: Array<{data: Array<number[]>, label: string}> = [];

	drawingSize:number = 0;

	hoverGroup: any = null;
	selectedGroup: any = null;

	@Input()
	groups: Array<{id: string, title: string}>;
	
	@Input()
	data = {
		groups: [],
		budgetAmount: 0,
		groupIndex: {},
		maxBudgetAmount: 0
	}
	
	@ViewChild('drawing')
	drawingEl: ElementRef

  ngAfterViewInit() {
		setTimeout(() => this.drawingSize = this.drawingEl.nativeElement.getBoundingClientRect().width);
  }
	
	getBgStripe(i){
		var x = this.drawingSize / 2;
		var y = this.drawingSize / 2;
		var innerRadius = 0;
		var outerRadius = this.drawingSize / 2;
		var start = this.groups.length ? i / this.groups.length : 0;
		var size = this.groups.length ? 1 / this.groups.length : 0;
		return this.getStripePath(x,y,innerRadius,outerRadius,start,size);	
	}

	getGroupStripe(group, i){
		
		var maxRadius = this.drawingSize / 2;
		var minRadius = 20;
		
		var x = this.drawingSize / 2;
		var y = this.drawingSize / 2;
		var innerRadius = 0;
		var outerRadius = minRadius + ((this.data.groupIndex[group.id] && this.data.groupIndex[group.id].expenditureAmount && this.data.maxBudgetAmount) ? (maxRadius - minRadius) * Math.sqrt(this.data.groupIndex[group.id].expenditureAmount / this.data.maxBudgetAmount) : 0);
		var start = this.groups.length ? i / this.groups.length : 0;
		var size = this.groups.length ? 1 / this.groups.length : 0;
		return this.getStripePath(x,y,innerRadius,outerRadius,start,size);	
	}

	getStripePath(x,y,innerRadius,outerRadius,start,size){
		if(size >= 1) size = 0.9999;

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

		var outerArc = (size > 0.5 ? 1 : 0);

		var properties = [];
		properties.push("M" + startX1 + "," + startY1);
		properties.push("A" + outerRadius + "," + outerRadius + " 0 " + outerArc + ",1 " + endX1 + "," + endY1);
		properties.push("L" + startX2 + "," + startY2);
		properties.push("A" + innerRadius + "," + innerRadius + " 0 " + outerArc + ",0 " + endX2 + "," + endY2);
		properties.push("Z");

		return properties.join(" ");	
	}
}