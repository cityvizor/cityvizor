import { Component, Input } from '@angular/core';

import { DataService } from '../../services/data.service';

import { BudgetParagraphs } from './budget-paragraph.data';
import { BudgetItems } from './budget-items.data';
import { Group, Paragraph, BudgetItem, ExpenditureEvent } from './expenditure-view.schema';

import { ToastService } 		from '../../services/toast.service';

@Component({
	moduleId: module.id,
	selector: 'expenditure-view',
	templateUrl: 'expenditure-view.template.html',
	styles: [`
		hr{margin-bottom:0;}
	`]
})
export class ExpenditureViewComponent {

	// decides which part (vizualization, map or table) will be shown
	show: string = 'viz';
	
	@Input()
	set ico(ico: string){
		this.loadData(ico,this.year);
	}
	
	// decides which year's data should be loaded
	year: number;

	// the data loaded, parsed and restructured from the CSV file
	data = {
		ico: this.ico,
		year: this.year,
		events: [],
		budget: {
			expenditureAmount: 0,
			maxExpenditureAmount: 0,
			budgetAmount: 0,
			maxBudgetAmount: 0,
			paragraphs: [],
			groups:[],
			groupIndex: {}
		}
	};

	constructor(private _ds: DataService, private _toastService: ToastService) {
		this.year = (new Date()).getFullYear();
	}
	
	// numbers are parsed from CSV as text
	string2number(string){
		if(string.charAt(string.length - 1) === "-") string = "-" + string.substring(0,string.length - 1); //sometimes minus is at the end, put it to first character
		string.replace(",","."); // function Number accepts only dot as decimal point
		return Number(string);																									
	}

	loadData(ico,year){
		
		if(!ico || !year) return;
		
		var loadingToast = this._toastService.toast("Načítám data o výdajích...", "loading", true);
		
		// data on expenditures (from the organization accounting software) are loaded and parsed.
		var i = 0;
		// we get an Observable
		this._ds.getExpenditures(ico,year).then((data) => {
			
			this.linkData(data);
			this.sortData(data);
			console.log(data);
			this.data = data;
			loadingToast.hide();
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

	linkData(data){
		
		data.budget.paragraphIndex = {};
		data.budget.groupIndex = {};
		
		data.budget.maxBudgetAmount = 0;
		data.budget.maxExpenditureAmount = 0;
		
		data.budget.groups.forEach(group => {
			data.budget.maxBudgetAmount = Math.max(data.budget.maxBudgetAmount,group.budgetAmount);
			data.budget.maxExpenditureAmount = Math.max(data.budget.maxExpenditureAmount,group.expenditureAmount);
			data.budget.groupIndex[group.id] = group;
			group.paragraphs = [];
		});
		
		data.budget.paragraphs.forEach((paragraph) => {
			var groupId = paragraph.id.substring(0, 2);	
			var group = data.budget.groupIndex[groupId];
			group.paragraphs.push(paragraph);
			data.budget.paragraphIndex[paragraph.id] = paragraph;
			paragraph.events = [];
		});
		
		data.events.forEach(event => {
			event.paragraphIndex = {};
			event.paragraphs.forEach(eventParagraph => {
				var paragraph = data.budget.paragraphIndex[eventParagraph.id];
				paragraph.events.push(event);
				event.paragraphIndex[eventParagraph.id] = eventParagraph;
			});
		});
		
	}
	
	sortData(data){

		var field1 = "expenditureAmount";
		var field2 = "budgetAmount";
		
		data.budget.groups.sort((a,b) => b[field1] !== a[field1] ? b[field1] - a[field1] : b[field2] - a[field2]);
	}
}