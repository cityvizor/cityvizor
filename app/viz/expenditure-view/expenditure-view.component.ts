import { Component, Input } from '@angular/core';

import { DataService } from '../../services/data.service';
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
	set profile(profile: any ){
		if(profile && profile.entity && profile.entity._id) this.loadData(profile.entity._id,this.year);
	}
	
	// decides which year's data should be loaded
	year: number;

	// the data loaded, parsed and restructured from the CSV file
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

	constructor(private _ds: DataService, private _toastService: ToastService) {
		this.year = (new Date()).getFullYear();
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
		this._ds.getExpenditures(id,year)
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
}