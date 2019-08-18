export interface Budget {
	year: number,
  
  budgetExpenditureAmount: number,
	budgetIncomeAmount: number,
	expenditureAmount: number,
  incomeAmount: number,
  
	paragraphs: [{
		id: string,
		events: [{
			event: number
			name: string,
			budgetExpenditureAmount: number,
			expenditureAmount: number
		}],
		budgetExpenditureAmount: number,
		expenditureAmount: number
  }],
  
	items: [{
		id: string,
		events: [{
			event: number,
			name: string,
			budgetExpenditureAmount: number,
			budgetIncomeAmount: number,
			expenditureAmount: number,
			incomeAmount: number
		}],
		budgetExpenditureAmount: number,
		budgetIncomeAmount: number,
		expenditureAmount: number,
		incomeAmount: number
	}]
}