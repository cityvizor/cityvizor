import { Balances } from "./balances";

export class TreeBudgetEvent implements Balances {

  name?: string;

  incomeAmount: number = 0;
  budgetIncomeAmount: number = 0;
  expenditureAmount: number = 0;
  budgetExpenditureAmount: number = 0;

  constructor(public event: number) { }
}

export class TreeBudgetParagraph implements Balances {

  incomeAmount: number = 0;
  budgetIncomeAmount: number = 0;
  expenditureAmount: number = 0;
  budgetExpenditureAmount: number = 0;

  events: TreeBudgetEvent[] = [];

  constructor(public id: number) { }
}

export class TreeBudgetItem implements Balances {

  incomeAmount: number = 0;
  budgetIncomeAmount: number = 0;
  expenditureAmount: number = 0;
  budgetExpenditureAmount: number = 0;

  events: TreeBudgetEvent[] = [];

  constructor(public id: number) { }
}

export class TreeBudget implements Balances {
  year: number;
  profile: string;

  incomeAmount: number = 0;
  budgetIncomeAmount: number = 0;
  expenditureAmount: number = 0;
  budgetExpenditureAmount: number = 0;

  paragraphs: TreeBudgetParagraph[] = [];
  items: TreeBudgetItem[] = [];

}