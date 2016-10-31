import { Component, Input, ViewChild, ElementRef } from '@angular/core';

const ChartGroups = [
	{"id":"10", "title": "Zemědělství, lesní hospodářství a rybářství"},
	{"id":"21", "title": "Průmysl, stavebnictví, obchod a služby"},
	{"id":"22", "title": "Doprava"},
	{"id":"23", "title": "Vodní hospodářství"},
	{"id":"24", "title": "Spoje"},
	{"id":"25", "title": "Všeobecné hospodářské záležitosti a ostatní ekonomické funkce"},
	{"id":"31", "title": "Vzdělávání a školské služby"},
	{"id":"32", "title": "Vzdělávání a školské služby"},
	{"id":"33", "title": "Kultura, církve a sdělovací prostředky"},
	{"id":"34", "title": "Tělovýchova a zájmová činnost"},
	{"id":"35", "title": "Zdravotnictví"},
	{"id":"36", "title": "Bydlení, komunální služby a územní rozvoj"},
	{"id":"37", "title": "Ochrana životního prostředí"},
	{"id":"38", "title": "Ostatní výzkum a vývoj"},
	{"id":"39", "title": "Ostatní činnosti související se službami pro obyvatelstvo"},
	{"id":"41", "title": "Dávky a podpory v sociálním zabezpečení"},
	{"id":"42", "title": "Politika zaměstnanosti"},
	{"id":"43", "title": "Sociální služby a společné činnosti v sociálním zabezpečení a politice zaměstnanosti"},
	{"id":"51", "title": "Obrana"},
	{"id":"52", "title": "Civilní připravenost na krizové stavy"},
	{"id":"53", "title": "Bezpečnost a veřejný pořádek"},
	{"id":"54", "title": "Právní ochrana"},
	{"id":"55", "title": "Požární ochrana a integrovaný záchranný systém"},
	{"id":"61", "title": "Státní moc, státní správa, územní samospráva a politické strany"},
	{"id":"62", "title": "Jiné veřejné služby a činnosti"},
	{"id":"63", "title": "Finanční operace"},
	{"id":"64", "title": "Ostatní činnosti"}
];

@Component({
	moduleId: module.id,
	selector: 'expenditure-viz',
	templateUrl: 'expenditure-viz.template.html',
	styles: [`
		svg{margin:0 auto;display:block;}
		.stripe{cursor:pointer;border:2px solid #fff;}
		.stripe.active{background-color:#f00;}
		.bgstripe{opacity:0;cursor:pointer;}
		.bgstripe:hover, .bgstripe.active{opacity:0.2;}

		.viztable{width:100%;}
		.viztable th{font-weight:normal;}
		.viztable td{font-weight:normal;width:150px;text-align:right;}
	`]
})
export class ExpenditureVizComponent{
	
	// the size of the #drawing element, parent of the SVG drawing
	drawingElSize: number = 0;
	// the size of the actual drawing
	drawingSize: number = 0;

	// which group (drawing stripe) is hovered at the moment
	hoverGroup: any = null;
	// which group (drawign stripe) has been clicked and is open at the moment
	selectedGroup: any = null;

	groups: Array<{id: string, title: string}> = [];
	
	@Input()
	data = {
		groups: [],
		budgetAmount: 0,
		groupIndex: {},
		maxBudgetAmount: 0
	}
	
	@ViewChild('drawing')
	drawingEl: ElementRef
	
	constructor(){
		this.groups	= ChartGroups;
	}

  ngAfterViewInit() {
		setTimeout(() => this.drawingSize = this.drawingElSize = this.drawingEl.nativeElement.getBoundingClientRect().width);
  }

	selectGroup(group){
		this.selectedGroup = group;
		this.drawingSize = group ? this.drawingElSize / 2 : this.drawingElSize;
	}

	getEStripePath(i,group){
		var min = 4 / (this.drawingSize / 2);
		var inner = 0;
		var outer = min + (1 - min) * (this.data.groupIndex[group.id] && this.data.maxBudgetAmount ? this.data.groupIndex[group.id].expenditureAmount / this.data.maxBudgetAmount : 0);
		return this.getStripePath(i,inner,outer);
	}

	getBStripePath(i,group){
		var min = 4 / (this.drawingSize / 2);
		var inner = min + (1-min) * (this.data.groupIndex[group.id] && this.data.maxBudgetAmount ? this.data.groupIndex[group.id].expenditureAmount / this.data.maxBudgetAmount : 0);
		var outer = this.data.groupIndex[group.id] && this.data.maxBudgetAmount ? (this.data.groupIndex[group.id].budgetAmount - this.data.groupIndex[group.id].expenditureAmount) / this.data.maxBudgetAmount : 0;
		return this.getStripePath(i,inner,outer);
	}

	getStripePath(i,inner,outer){

		i = Math.min(Math.max(i,0),this.groups.length);
		inner = Math.max(inner,0);
		outer = Math.max(outer,inner,0);

		var x = this.drawingSize / 2;
		var y = this.drawingSize / 2;
		var innerRadius = Math.sqrt(inner) * this.drawingSize / 2;
		var outerRadius = Math.sqrt(outer) * this.drawingSize / 2;
		var start = this.groups.length ? i / this.groups.length : 0;
		var size = this.groups.length ? 1 / this.groups.length : 0;
		return this.generateStripePath(x,y,innerRadius,outerRadius,start,size);	
	}

	generateStripePath(x,y,innerRadius,outerRadius,start,size){
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