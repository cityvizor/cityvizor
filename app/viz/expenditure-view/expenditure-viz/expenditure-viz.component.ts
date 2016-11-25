import { Component, Input } from '@angular/core';

// array with groups that vizualization is made of (fixed, does not vary with data) 
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

const LoremIpsumReceipts = [
	{"id":"10", "date":"12.8.2016", "supplier": "IBM software GBMH", "amount": "150000"},
	{"id":"21", "date":"15.8.2016", "supplier": "Agrofert a.s.", "amount": "23500"},
	{"id":"22", "date":"1.9.2016", "supplier": "Nadace Agrofert s.r.o.", "amount": "50000"},
	{"id":"23", "date":"12.10.2016", "supplier": "Gordic s.r.o.", "amount": "18154"}
];

/*

Component for graphical vizualization of expenditures

*/
@Component({
	moduleId: module.id,
	selector: 'expenditure-viz',
	templateUrl: 'expenditure-viz.template.html',
	styleUrls: ['expenditure-viz.style.css']
})
export class ExpenditureVizComponent{
	
	// the dimensions of the drawing	
	scale: number = 1;
	r: number = 500;	// set according to drawingElSize
 	cx: number = 500;
 	cy: number = 500;
	innerSize: number = 0.04;
	minSize: number = 0.008;
	showAmounts: boolean = true; // shows/hides budgetAmount and expenditureAmount in circle of vizualization
	showGroupTitles: boolean = true; // shows/hides budgetAmount and expenditureAmount in circle of vizualization

	loremIpsumReceipts: Array<{id: string, date:string, supplier: string, amount: string}> = [];
	// array with groups that vizualization is made of (fixed, does not vary with data)
	groups: Array<{id: string, title: string}> = [];
  // which group (drawing stripe) is hovered at the moment
	hoverGroup: any = null;
	// which group (drawign stripe) has been clicked and is open at the moment
	selectedGroup: any = null;

	// the data used in vizualization, imputted by data attribute of its DOM element
	@Input()
	data: any;
	
	constructor(){
		this.groups = ChartGroups; // set groups
		this.loremIpsumReceipts = LoremIpsumReceipts; // set groups
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
 
	// select group (e.g. after clicking a stripe)
	selectGroup(group){
		this.selectedGroup = group;
		this.scale = this.selectedGroup !== null ?  0.5 : 1;
		
		this.showAmounts = this.selectedGroup !== null ?  false : true;
		this.showGroupTitles = this.selectedGroup !== null ?  false : true;
	}

	getCircleR(){
		return Math.sqrt(this.innerSize) * this.r;	
	}

	// generate path for group expenditures
	getEStripePath(i,group){
		var inner = this.innerSize;
		var outer = this.innerSize + this.minSize + (1 - this.minSize - this.innerSize) * (this.data.budget.groupIndex[group.id] && this.data.budget.maxBudgetAmount ? this.data.budget.groupIndex[group.id].expenditureAmount / this.data.budget.maxBudgetAmount : 0);
		return this.getStripePath(i,inner,outer);
	}

	// generate path for group total budget minus expenditures
	getBStripePath(i,group){
		var inner = this.innerSize + this.minSize + (1 - this.minSize - this.innerSize) * (this.data.budget.groupIndex[group.id] && this.data.budget.maxBudgetAmount ? this.data.budget.groupIndex[group.id].expenditureAmount / this.data.budget.maxBudgetAmount : 0);
		var outer = this.innerSize + this.minSize + (1 - this.minSize - this.innerSize) * (this.data.budget.groupIndex[group.id] && this.data.budget.maxBudgetAmount ? this.data.budget.groupIndex[group.id].budgetAmount / this.data.budget.maxBudgetAmount : 0);
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