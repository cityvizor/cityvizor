import { Component, Input } from '@angular/core';

import { DataService } from '../../services/data.service';
import { ToastService } 		from '../../services/toast.service';

import { paragraphNames } from '../../shared/data/paragraph-names.data';

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
	
	/* DATA */
	@Input()
	set profile(profile: any ){
		if(profile) this.loadData(profile._id,this.year);
	}
	
	// decides which year's data should be loaded
	year: number = 2016;

	// the data loaded
	data = {
		year: this.year,
		
		events: [],
		groups:[],
		paragraphs: [],
		
		expenditureAmount: 0,
		maxExpenditureAmount: 0,
		budgetAmount: 0,
		maxBudgetAmount: 0,
		
		groupIndex: {},
		paragraphIndex: {},
		eventIndex: {}
	};
	
	/* VIZ */

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

	paragraphNames = paragraphNames;
	
	constructor(private _ds: DataService, private _toastService: ToastService){
		this.groups = ChartGroups; // set groups
		this.loremIpsumReceipts = LoremIpsumReceipts; // set groups
	}
	 
	 // numbers are parsed from CSV as text
	string2number(string){
		if(string.charAt(string.length - 1) === "-") string = "-" + string.substring(0,string.length - 1); //sometimes minus is at the end, put it to first character
		string.replace(",","."); // function Number accepts only dot as decimal point
		return Number(string);																									
	}

	loadData(id,year){
		
		if(!id || !year) return;
		
		var loadingToast = this._toastService.toast("Načítám data o výdajích...", "loading", true);
		
		// data on expenditures (from the organization accounting software) are loaded and parsed.
		var i = 0;
		
		// we get a Promise
		this._ds.getBudget(id,year)
			.then((data) => {
				this.linkData(data);
				this.sortData(data);
				console.log(data);
				this.data = data;
				loadingToast.hide();
			})
			.catch((err) => {
				loadingToast.hide();
				switch(err.status){
					case 404:
						this._toastService.toast("Data nejsou k dispozici", "warning");
					case 503:
						this._toastService.toast("Služba je momentálně nedostupná", "warning");
					default:
						this._toastService.toast("Nastala neočekávaná chyba","error");
				}
			});
	}

	findItem(array,id){
		var found;
		array.some(item => {
			if(item.id === id) {
				found = item;
				return true;
			}
			return false;
		});			
		return found;
	}

	getGroupByParagraph(data,paragraph){
		var groupId = paragraph.id.substring(0, 2);	
		if(!data.groupIndex[groupId]){
			var group = {
				id: groupId,
				budgetAmount:0,
				expenditureAmount:0,
				paragraphs: []
			}
			data.groupIndex[groupId] = group;
			data.groups.push(group);
		}		
		return data.groupIndex[groupId];
	}

	linkData(data){
		
		data.groups = [];
		
		data.paragraphIndex = {};
		data.groupIndex = {};
		
		data.maxBudgetAmount = 0;
		data.maxExpenditureAmount = 0;
		
		data.paragraphs.forEach(paragraph => {
			var group = this.getGroupByParagraph(data,paragraph);		
			group.budgetAmount += paragraph.budgetAmount;
			group.expenditureAmount += paragraph.expenditureAmount;
			group.paragraphs.push(paragraph);
			
			data.paragraphIndex[paragraph.id] = paragraph;
		});
		
		data.groups.forEach(group => {
			data.maxBudgetAmount = Math.max(data.maxBudgetAmount,group.budgetAmount);
			data.maxExpenditureAmount = Math.max(data.maxExpenditureAmount,group.expenditureAmount);
		});
		
	}
	
	sortData(data){

		var field1 = "expenditureAmount";
		var field2 = "budgetAmount";
		
		data.groups.sort((a,b) => b[field1] !== a[field1] ? b[field1] - a[field1] : b[field2] - a[field2]);
		data.paragraphs.forEach(paragraph => {
			paragraph.events.sort((a,b) => b[field1] !== a[field1] ? b[field1] - a[field1] : b[field2] - a[field2]);
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
 
	// select group (e.g. after clicking a stripe)
	selectGroup(group,scroll){
		this.selectedGroup = group;
		this.scale = this.selectedGroup !== null ?  0.5 : 1;
		
		this.showAmounts = this.selectedGroup !== null ?  false : true;
		this.showGroupTitles = this.selectedGroup !== null ?  false : true;
		
		/*
		if(scroll) {
			var e = document.getElementsByClassName('tr-focus');
			var tE = document.getElementById('groupListTableBody');

			if (e != null && tE != null) {
				var rE = e[0];

				console.log(tE.scrollTop);
				console.log(tE.offsetHeight);
				console.log(rE.offsetTop);

				tE.scrollTop=Math.max(0,Math.round(rE.offsetTop-tE.offsetHeight/2));
			} 
		}*/
	}

	getCircleR(){
		return Math.sqrt(this.innerSize) * this.r;	
	}

	getBarBudgetPercentage(group) {
		if(!this.data.groupIndex[group.id]) return 0;
		return Math.round(this.data.groupIndex[group.id].budgetAmount / this.data.maxBudgetAmount * 100);
	}
	getBarExpenditurePercentage(group) {
		if(!this.data.groupIndex[group.id]) return 0;
		return Math.round(this.data.groupIndex[group.id].expenditureAmount / this.data.groupIndex[group.id].budgetAmount * 100);
	}

	// generate path for group expenditures
	getEStripePath(i,group){
		var inner = this.innerSize;
		var outer = this.innerSize + this.minSize + (1 - this.minSize - this.innerSize) * (this.data.groupIndex[group.id] && this.data.maxBudgetAmount ? this.data.groupIndex[group.id].expenditureAmount / this.data.maxBudgetAmount : 0);
		return this.getStripePath(i,inner,outer);
	}

	// generate path for group total budget minus expenditures
	getBStripePath(i,group){
		var inner = this.innerSize + this.minSize + (1 - this.minSize - this.innerSize) * (this.data.groupIndex[group.id] && this.data.maxBudgetAmount ? this.data.groupIndex[group.id].expenditureAmount / this.data.maxBudgetAmount : 0);
		var outer = this.innerSize + this.minSize + (1 - this.minSize - this.innerSize) * (this.data.groupIndex[group.id] && this.data.maxBudgetAmount ? this.data.groupIndex[group.id].budgetAmount / this.data.maxBudgetAmount : 0);
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