[33mcommit 162f48129b708644eedf4cbeea7e69fb51c78326[m
Author: codeanywhere <codeanywhere@smallhill.cz>
Date:   Tue Nov 1 12:58:33 2016 -0400

    Optimalizace kodu vizualizace, nejake komentare

[1mdiff --git a/app/dataviz/expenditure-view/expenditure-view.component.ts b/app/dataviz/expenditure-view/expenditure-view.component.ts[m
[1mindex a4c475c..3139777 100644[m
[1m--- a/app/dataviz/expenditure-view/expenditure-view.component.ts[m
[1m+++ b/app/dataviz/expenditure-view/expenditure-view.component.ts[m
[36m@@ -12,15 +12,19 @@[m [mimport { Group, Paragraph, BudgetItem, ExpenditureEvent } from './expenditure-vi[m
 	moduleId: module.id,[m
 	selector: 'expenditure-view',[m
 	templateUrl: 'expenditure-view.template.html',[m
[31m-	styleUrls: ['expenditure-view.style.css'][m
[32m+[m	[32mstyles: [`[m
[32m+[m		[32mhr{margin-bottom:0;}[m
[32m+[m	[32m`][m
 })[m
 export class ExpenditureViewComponent implements OnInit {[m
 [m
[31m-[m
[32m+[m	[32m// decides which part (vizualization, map or table) will be shown[m
 	show: string = 'viz';[m
 	[m
[32m+[m	[32m// decides which year's data should be loaded[m
 	year: number;[m
 [m
[32m+[m	[32m// the data loaded, parsed and restructured from the CSV file[m
 	data = {[m
 		groups: [],[m
 		groupIndex: {},[m
[36m@@ -36,37 +40,41 @@[m [mexport class ExpenditureViewComponent implements OnInit {[m
 		this.year = (new Date()).getFullYear();[m
 	}[m
 	[m
[32m+[m	[32m// numbers are parsed from CSV as text[m
 	string2number(string){[m
[31m-		if(string.charAt(string.length - 1) === "-") string = "-" + string.substring(0,string.length - 1);[m
[31m-		string.replace(",",".");[m
[32m+[m		[32mif(string.charAt(string.length - 1) === "-") string = "-" + string.substring(0,string.length - 1); //sometimes minus is at the end, put it to first character[m
[32m+[m		[32mstring.replace(",","."); // function Number accepts only dot as decimal point[m
 		return Number(string);																									[m
 	}[m
 [m
 	ngOnInit(){[m
[32m+[m		[32m// data on budget (originally from Monitor) and on expenditures (from the organization accounting software) are loaded and parsed in parallel.[m[41m [m
 		this.route.parent.params.forEach((params: Params) => {[m
 			this._ds.getBudget(params["id"],this.year).then(data => this.loadBudget(data));[m
 			this._ds.getExpenditures(params["id"],this.year).then(data => this.loadExpenditures(data));[m
 		});[m
 	}[m
 	[m
[32m+[m	[32m // TODO: OPTIMIZE to include data only on desired level[m
 	getGroup(paragraphId){[m
 		[m
[31m-		var groupLevel = 2;[m
[32m+[m		[32mvar groupLevel = 2; // the level used to set groups; 3=Skupina, 2=Oddíl, 1= Pododdíl, 0= Paragraf[m
 		var groupId = paragraphId.substring(0,4 - groupLevel);[m
 		[m
[31m-		if(this.data.groupIndex[groupId]) return this.data.groupIndex[groupId];[m
[32m+[m		[32mif(this.data.groupIndex[groupId]) return this.data.groupIndex[groupId]; // if group object already created, no need to create new[m
 		[m
 		var groupName = BudgetParagraphs[paragraphId].parents[3 - groupLevel];[m
 		[m
[31m-		this.data.groups.push(new Group(groupId,groupName));[m
[31m-[m
[31m-		return this.data.groupIndex[groupId] = this.data.groups[this.data.groups.length - 1];[m
[32m+[m		[32mthis.data.groups.push(new Group(groupId,groupName)); // create new group in the groups array[m
[32m+[m		[32mthis.data.groupIndex[groupId] = this.data.groups[this.data.groups.length - 1]; // add the reference to the group also to groupIndex object, to access group by its ID[m
[32m+[m[41m		[m
[32m+[m		[32mreturn this.data.groupIndex[groupId];[m
 [m
 	}[m
 	[m
 	getParagraph(parent,paragraphId){[m
 		[m
[31m-		if(parent.paragraphIndex[paragraphId]) return parent.paragraphIndex[paragraphId];[m
[32m+[m		[32mif(parent.paragraphIndex[paragraphId]) return parent.paragraphIndex[paragraphId]; // if paragraph object already created, no need to create new[m
 		[m
 		var paragraphName = BudgetParagraphs[paragraphId].name;[m
 		[m
[1mdiff --git a/app/dataviz/expenditure-view/expenditure-viz/expenditure-viz.component.ts b/app/dataviz/expenditure-view/expenditure-viz/expenditure-viz.component.ts[m
[1mindex d4ae939..3210331 100644[m
[1m--- a/app/dataviz/expenditure-view/expenditure-viz/expenditure-viz.component.ts[m
[1m+++ b/app/dataviz/expenditure-view/expenditure-viz/expenditure-viz.component.ts[m
[36m@@ -1,5 +1,6 @@[m
[31m-import { Component, Input, ViewChild, ElementRef } from '@angular/core';[m
[32m+[m[32mimport { Component, Input } from '@angular/core';[m
 [m
[32m+[m[32m// array with groups that vizualization is made of (fixed, does not vary with data)[m[41m [m
 const ChartGroups = [[m
 	{"id":"10", "title": "Zemědělství, lesní hospodářství a rybářství"},[m
 	{"id":"21", "title": "Průmysl, stavebnictví, obchod a služby"},[m
[36m@@ -30,17 +31,37 @@[m [mconst ChartGroups = [[m
 	{"id":"64", "title": "Ostatní činnosti"}[m
 ];[m
 [m
[32m+[m[32mconst ChartGroups2 = [[m
[32m+[m	[32m{"id": "1", "title": "Zemědělství, lesní hospodářství a rybářství"},[m
[32m+[m	[32m{"id": "2", "title": "Průmyslová a ostatní odvětví hospodářství"},[m
[32m+[m	[32m{"id": "3", "title": "Služby pro obyvatelstvo"},[m
[32m+[m	[32m{"id": "4", "title": "Sociální věci a politika zaměstnanosti"},[m
[32m+[m	[32m{"id": "5", "title": "Bezpečnost státu a právní ochrana"},[m
[32m+[m	[32m{"id": "6", "title": "Všeobecná veřejná správa a služby"}[m
[32m+[m[32m];[m
[32m+[m
[32m+[m
[32m+[m[32m/*[m
[32m+[m
[32m+[m[32mComponent for graphical vizualization of expenditures[m
[32m+[m
[32m+[m[32m*/[m
 @Component({[m
 	moduleId: module.id,[m
 	selector: 'expenditure-viz',[m
 	templateUrl: 'expenditure-viz.template.html',[m
 	styles: [`[m
[32m+[m
[32m+[m		[32mdiv.drawing{background-color:rgba(0,0,0,0.02);}[m
[32m+[m
 		svg{margin:0 auto;display:block;}[m
 		.stripe{cursor:pointer;border:2px solid #fff;}[m
 		.stripe.active{background-color:#f00;}[m
 		.bgstripe{opacity:0;cursor:pointer;}[m
 		.bgstripe:hover, .bgstripe.active{opacity:0.2;}[m
 [m
[32m+[m		[32m.circle{cursor:pointer;}[m
[32m+[m
 		.viztable{width:100%;}[m
 		.viztable th{font-weight:normal;}[m
 		.viztable td{font-weight:normal;width:150px;text-align:right;}[m
[36m@@ -48,18 +69,22 @@[m [mconst ChartGroups = [[m
 })[m
 export class ExpenditureVizComponent{[m
 	[m
[31m-	// the size of the #drawing element, parent of the SVG drawing[m
[31m-	drawingElSize: number = 0;[m
[31m-	// the size of the actual drawing[m
[31m-	drawingSize: number = 0;[m
[31m-[m
[31m-	// which group (drawing stripe) is hovered at the moment[m
[32m+[m	[32m// the dimensions of the drawing[m[41m	[m
[32m+[m	[32mscale: number = 1;[m
[32m+[m	[32mr: number = 500;	// set according to drawingElSize[m
[32m+[m[41m [m	[32mcx: number = 500;[m
[32m+[m[41m [m	[32mcy: number = 500;[m
[32m+[m	[32minnerSize: number = 0.003;[m
[32m+[m	[32mminSize: number = 0.003;[m
[32m+[m
[32m+[m	[32m// array with groups that vizualization is made of (fixed, does not vary with data)[m
[32m+[m	[32mgroups: Array<{id: string, title: string}> = [];[m
[32m+[m[32m  // which group (drawing stripe) is hovered at the moment[m
 	hoverGroup: any = null;[m
 	// which group (drawign stripe) has been clicked and is open at the moment[m
 	selectedGroup: any = null;[m
 [m
[31m-	groups: Array<{id: string, title: string}> = [];[m
[31m-	[m
[32m+[m	[32m// the data used in vizualization, imputted by data attribute of its DOM element[m
 	@Input()[m
 	data = {[m
 		groups: [],[m
[36m@@ -68,53 +93,51 @@[m [mexport class ExpenditureVizComponent{[m
 		maxBudgetAmount: 0[m
 	}[m
 	[m
[31m-	@ViewChild('drawing')[m
[31m-	drawingEl: ElementRef[m
[31m-	[m
 	constructor(){[m
[31m-		this.groups	= ChartGroups;[m
[32m+[m		[32mthis.groups	= ChartGroups; // set groups[m
 	}[m
[31m-[m
[31m-  ngAfterViewInit() {[m
[31m-		setTimeout(() => this.drawingSize = this.drawingElSize = this.drawingEl.nativeElement.getBoundingClientRect().width);[m
[31m-  }[m
[31m-[m
[32m+[m[41m [m
[32m+[m	[32m// select group (e.g. after clicking a stripe)[m
 	selectGroup(group){[m
 		this.selectedGroup = group;[m
[31m-		this.drawingSize = group ? this.drawingElSize / 2 : this.drawingElSize;[m
[32m+[m		[32mthis.scale = this.selectedGroup !== null ?  0.5 : 1;[m
[32m+[m	[32m}[m
[32m+[m
[32m+[m	[32mgetCircleR(){[m
[32m+[m		[32mreturn Math.sqrt(this.innerSize) * this.r;[m[41m	[m
 	}[m
 [m
[32m+[m	[32m// generate path for group expenditures[m
 	getEStripePath(i,group){[m
[31m-		var min = 4 / (this.drawingSize / 2);[m
[31m-		var inner = 0;[m
[31m-		var outer = min + (1 - min) * (this.data.groupIndex[group.id] && this.data.maxBudgetAmount ? this.data.groupIndex[group.id].expenditureAmount / this.data.maxBudgetAmount : 0);[m
[32m+[m		[32mvar inner = 0[m
[32m+[m		[32mvar outer = this.innerSize + this.minSize + (1 - this.minSize - this.innerSize) * (this.data.groupIndex[group.id] && this.data.maxBudgetAmount ? this.data.groupIndex[group.id].expenditureAmount / this.data.maxBudgetAmount : 0);[m
 		return this.getStripePath(i,inner,outer);[m
 	}[m
 [m
[32m+[m	[32m// generate path for group total budget minus expenditures[m
 	getBStripePath(i,group){[m
[31m-		var min = 4 / (this.drawingSize / 2);[m
[31m-		var inner = min + (1-min) * (this.data.groupIndex[group.id] && this.data.maxBudgetAmount ? this.data.groupIndex[group.id].expenditureAmount / this.data.maxBudgetAmount : 0);[m
[31m-		var outer = this.data.groupIndex[group.id] && this.data.maxBudgetAmount ? (this.data.groupIndex[group.id].budgetAmount - this.data.groupIndex[group.id].expenditureAmount) / this.data.maxBudgetAmount : 0;[m
[32m+[m		[32mvar inner = this.innerSize + this.minSize + (1 - this.minSize - this.innerSize) * (this.data.groupIndex[group.id] && this.data.maxBudgetAmount ? this.data.groupIndex[group.id].expenditureAmount / this.data.maxBudgetAmount : 0);[m
[32m+[m		[32mvar outer = this.innerSize + this.minSize + (1 - this.minSize - this.innerSize) * (this.data.groupIndex[group.id] && this.data.maxBudgetAmount ? (this.data.groupIndex[group.id].budgetAmount - this.data.groupIndex[group.id].expenditureAmount) / this.data.maxBudgetAmount : 0);[m
 		return this.getStripePath(i,inner,outer);[m
 	}[m
 [m
[32m+[m	[32m// generate stripe by index, and inner and outer percentage size[m
 	getStripePath(i,inner,outer){[m
 [m
[31m-		i = Math.min(Math.max(i,0),this.groups.length);[m
[31m-		inner = Math.max(inner,0);[m
[31m-		outer = Math.max(outer,inner,0);[m
[32m+[m		[32mi = Math.min(Math.max(i,0),this.groups.length); // i ranges from 0 to number of groups[m
[32m+[m		[32minner = Math.max(inner,0); // inner size must be greater than 0[m
[32m+[m		[32mouter = Math.max(outer,inner); // outer size must be greater than inner[m
 [m
[31m-		var x = this.drawingSize / 2;[m
[31m-		var y = this.drawingSize / 2;[m
[31m-		var innerRadius = Math.sqrt(inner) * this.drawingSize / 2;[m
[31m-		var outerRadius = Math.sqrt(outer) * this.drawingSize / 2;[m
[32m+[m		[32mvar innerRadius = Math.sqrt(inner) * this.r; // we want the size to grow with area of the stripe, therefore square root (inner and outer are stil 0~1, but square root shape)[m
[32m+[m		[32mvar outerRadius = Math.sqrt(outer) * this.r;[m
 		var start = this.groups.length ? i / this.groups.length : 0;[m
 		var size = this.groups.length ? 1 / this.groups.length : 0;[m
[31m-		return this.generateStripePath(x,y,innerRadius,outerRadius,start,size);	[m
[32m+[m		[32mreturn this.generateStripePath(this.cx,this.cy,innerRadius,outerRadius,start,size);[m[41m	[m
 	}[m
 [m
[32m+[m	[32m// generate SVG path attribute string for a donut stripe; start and size are percentage of whole[m
 	generateStripePath(x,y,innerRadius,outerRadius,start,size){[m
[31m-		if(size >= 1) size = 0.9999;[m
[32m+[m		[32mif(size >= 1) size = 0.9999; // if a stripe would be 100%, then it's circle, this is a hack to do it using this function instead of another[m
 		[m
 		var startAngle = 2 * Math.PI * start;[m
 		var angle =  2 * Math.PI * size;[m
[36m@@ -129,7 +152,7 @@[m [mexport class ExpenditureVizComponent{[m
 		var endX2 = x + Math.sin(startAngle) * innerRadius;[m
 		var endY2 = y - Math.cos(startAngle) * innerRadius;[m
 [m
[31m-		var outerArc = (size > 0.5 ? 1 : 0);[m
[32m+[m		[32mvar outerArc = (size > 0.5 ? 1 : 0); // decides which way will the arc go[m
 [m
 		var properties = [];[m
 		properties.push("M" + startX1 + "," + startY1);[m
[1mdiff --git a/app/dataviz/expenditure-view/expenditure-viz/expenditure-viz.template.html b/app/dataviz/expenditure-view/expenditure-viz/expenditure-viz.template.html[m
[1mindex 70fd4a6..9dd4981 100644[m
[1m--- a/app/dataviz/expenditure-view/expenditure-viz/expenditure-viz.template.html[m
[1m+++ b/app/dataviz/expenditure-view/expenditure-viz/expenditure-viz.template.html[m
[36m@@ -1,12 +1,14 @@[m
[31m-<div #drawing>[m
[31m-	<svg [attr.width]="drawingSize" [attr.height]="drawingSize">[m
[32m+[m[32m<div class="drawing" #drawing>[m
[32m+[m	[32m<svg [attr.width]="scale * 100 + '%'" viewBox="0 0 1000 1000">[m
 		[m
 		<g *ngFor="let group of groups; let i = index">[m
 			<path [attr.d]="getEStripePath(i, group)"  stroke-width="2" stroke="#fff" [attr.fill]="selectedGroup==group ? '#f00' : '#09f'" />[m
 			<path [attr.d]="getBStripePath(i, group)"  stroke-width="2" stroke="#fff" [attr.fill]="selectedGroup==group ? '#f00' : '#f90'" />[m
 			[m
[31m-			<path [attr.d]="getStripePath(i,0,1)" stroke-width="0" fill="#09f" class="bgstripe" (mouseover)="hoverGroup=group" (mouseout)="hoverGroup=null" (click)="selectGroup(group)" />[m
[32m+[m			[32m<path [attr.d]="getStripePath(i,innerSize,1)" stroke-width="0" fill="#09f" class="bgstripe" (mouseover)="hoverGroup=group" (mouseout)="hoverGroup=null" (click)="selectGroup(group)" />[m
 		</g>[m
[32m+[m[41m		[m
[32m+[m		[32m<circle [attr.r]="getCircleR()" [attr.cx]="cx" [attr.cy]="cy" [attr.fill]="selectedGroup==null ? '#f00' : '#09f'" stroke-width="2" stroke="#fff" (click)="selectGroup(null)" class="circle" />[m
 	</svg>[m
 </div>[m
 [m
