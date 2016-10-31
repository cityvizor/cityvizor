import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { DataService } from '../../services/data.service';

import { BudgetParagraphs } from './budget-paragraph.data';
import { BudgetItems } from './budget-items.data';
import { Group, Paragraph, BudgetItem, ExpenditureEvent } from './expenditure-view.schema';


@Component({
	moduleId: module.id,
	selector: 'expenditure-view',
	templateUrl: 'expenditure-view.template.html',
	styleUrls: ['expenditure-view.style.css']
})
export class ExpenditureViewComponent implements OnInit {


	show: string = 'viz';
	
	year: number;

	data = {
		groups: [],
		groupIndex: {},
		expenditureEvents: [],
		expenditureEventIndex: {},
		maxBudgetAmount: 0,
		maxExpenditureAmount: 0,
		budgetAmount:0,
		expenditureAmount:0
	};

	constructor(private route: ActivatedRoute,private _ds: DataService) {
		this.year = (new Date()).getFullYear();
	}
	
	string2number(string){
		if(string.charAt(string.length - 1) === "-") string = "-" + string.substring(0,string.length - 1);
		string.replace(",",".");
		return Number(string);																									
	}

	ngOnInit(){
		this.route.parent.params.forEach((params: Params) => {
			this._ds.getBudget(params["id"],this.year).then(data => this.loadBudget(data));
			this._ds.getExpenditures(params["id"],this.year).then(data => this.loadExpenditures(data));
		});
	}
	
	getGroup(paragraphId){
		
		var groupLevel = 2;
		var groupId = paragraphId.substring(0,4 - groupLevel);
		
		if(this.data.groupIndex[groupId]) return this.data.groupIndex[groupId];
		
		var groupName = BudgetParagraphs[paragraphId].parents[3 - groupLevel];
		
		this.data.groups.push(new Group(groupId,groupName));

		return this.data.groupIndex[groupId] = this.data.groups[this.data.groups.length - 1];

	}
	
	getParagraph(parent,paragraphId){
		
		if(parent.paragraphIndex[paragraphId]) return parent.paragraphIndex[paragraphId];
		
		var paragraphName = BudgetParagraphs[paragraphId].name;
		
		parent.paragraphs.push(new Paragraph(paragraphId,paragraphName));
		
		return parent.paragraphIndex[paragraphId] = parent.paragraphs[parent.paragraphs.length - 1];

	}
	
	getBudgetItem(parent,budgetItemId){
		
		if(parent.budgetItemsIndex[budgetItemId]) return parent.budgetItemsIndex[budgetItemId];
		
		var budgetItemName = BudgetItems[budgetItemId];
		
		parent.budgetItems.push(new BudgetItem(budgetItemId,budgetItemName));
		
		return parent.budgetItemsIndex[budgetItemId] = parent.budgetItems[parent.budgetItems.length - 1];
	}
	
	getExpenditureEvent(id,name){
		
		if(this.data.expenditureEventIndex[id]) return this.data.expenditureEventIndex[id];
		
		this.data.expenditureEvents.push(new ExpenditureEvent(id,name));
		
		return this.data.expenditureEventIndex[id] = this.data.expenditureEvents[this.data.expenditureEvents.length - 1];
	}
	
	sortData(field: string){

		var field1 = "expenditureAmount";
		var field2 = "budgetAmount";
		
		this.data.groups.sort((a,b) => b[field1] !== a[field1] ? b[field1] - a[field1] : b[field2] - a[field2]);
		this.data.groups.forEach(group => {
			group.paragraphs.sort((a,b) => b[field1] !== a[field1] ? b[field1] - a[field1] : b[field2] - a[field2]);
			group.paragraphs.forEach(paragraph => paragraph.expenditureEvents.sort((a,b) => b[field1] !== a[field1] ? b[field1] - a[field1] : b[field2] - a[field2]));
		});
	}

	loadBudget(budgetData){

		if(!(budgetData instanceof Array)) return;

		var data = this.data;
		var _this = this;

		budgetData.forEach(function(item,i){
			if(i === 0) return; // header row
			if(item.length < 3) return; // invalid row
			
			var amount = _this.string2number(item[2]);
			
			if(amount === 0) return;

			var paragraphId = item[0];
			var budgetItemId = item[1];

			var group = _this.getGroup(paragraphId);
			var paragraph = _this.getParagraph(group,paragraphId);
			var budgetItem = _this.getBudgetItem(paragraph,budgetItemId);

			data.budgetAmount += amount;
			group.budgetAmount += amount;
			paragraph.budgetAmount += amount;
			budgetItem.budgetAmount += amount;

			if(group.budgetAmount > data.maxBudgetAmount) data.maxBudgetAmount = group.budgetAmount;
			if(paragraph.budgetAmount > group.maxBudgetAmount) group.maxBudgetAmount = paragraph.budgetAmount;

		});
	}
	
	loadExpenditures(expenditureData){

		if(!(expenditureData instanceof Array)) return;

		var data = this.data;
		var _this = this;

		expenditureData.forEach(function(item,i){
			if(i === 0) return; // header row
			if(item.length < 3) return; // invalid row
			
			var amount = _this.string2number(item[5]);
			
			if(amount === 0) return;

			var paragraphId = item[2];
			var budgetItemId = item[3];
			
			var group = _this.getGroup(paragraphId);
			var paragraph = _this.getParagraph(group,paragraphId);
			var budgetItem = _this.getBudgetItem(paragraph,budgetItemId);
			
			var expenditureEvent = _this.getExpenditureEvent(item[0],item[1]);
			var expenditureEventParagraph = _this.getParagraph(expenditureEvent,paragraphId);
			var expenditureEventBudgetItem = _this.getBudgetItem(expenditureEventParagraph,budgetItemId);
				
			if(!paragraph.expenditureEventIndex[expenditureEvent.id]){
				paragraph.expenditureEvents.push(expenditureEvent);
				paragraph.expenditureEventIndex[expenditureEvent.id] = paragraph.expenditureEvents[paragraph.expenditureEvents.length - 1];
			}
			
			data.expenditureAmount += amount;
			group.expenditureAmount += amount;
			paragraph.expenditureAmount += amount;			
			budgetItem.expenditureAmount += amount;
			expenditureEventParagraph.expenditureAmount += amount;
			expenditureEventBudgetItem.expenditureAmount += amount;
			
			expenditureEvent.expenditureAmount += amount;

			if(group.expenditureAmount > data.maxExpenditureAmount) data.maxExpenditureAmount = group.expenditureAmount;
			if(paragraph.expenditureAmount > group.maxExpenditureAmount) group.maxExpenditureAmount = paragraph.expenditureAmount;

		});
		
		this.sortData('expenditureAmount');
	};

}