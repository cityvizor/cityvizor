export class Group {
	id: string;
	name: string;
	budgetAmount: number = 0;
	maxBudgetAmount: number = 0;
	expenditureAmount: number = 0;
	maxExpenditureAmount: number = 0;
	paragraphs: Paragraph[] = [];
	paragraphIndex: {} = {};
	
	constructor(id: string,name: string){
		this.id = id;
		this.name = name;
	}
}

export class Paragraph {
	id: string;
	name: string;
	budgetAmount: number = 0;
	expenditureAmount: number = 0;
	budgetItems: BudgetItem[] = [];
	budgetItemsIndex: {} = {};
	expenditureEvents: ExpenditureEvent[] = [];
	expenditureEventIndex: {} = {};

	constructor(id: string,name: string){
		this.id = id;
		this.name = name;
	}
}

export class BudgetItem {
  id: string;
	name: string;
	budgetAmount: number = 0;
	expenditureAmount: number = 0;
	expenditures: any[];

	constructor(id: string,name: string){
		this.id = id;
		this.name = name;
	}
}

export class ExpenditureEvent {
	id: string;
	name: string;
	expenditureAmount: number = 0;
	paragraphs: Paragraph[] = [];
	paragraphIndex: {} = {};
	
	constructor(id: string,name: string){
		this.id = id;
		this.name = name;
	}
}