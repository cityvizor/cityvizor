import { Component, Input } from '@angular/core';


import { Group, Paragraph, BudgetItem, ExpenditureEvent } from '../expenditure-view.schema';

@Component({
	moduleId: module.id,
	selector: 'expenditure-list',
	templateUrl: 'expenditure-list.template.html'
})
export class ExpenditureListComponent{

	@Input()
	data: {} = {}
	
	openedGroup: Group;
	 
	openGroup(group: Group){
		this.openedGroup = group;
	}
	
}