export interface BudgetAmounts {
  incomeAmount: number;
  budgetIncomeAmount: number;
  expenditureAmount: number;
  budgetExpenditureAmount: number;
}

export interface BudgetTypedAmounts {
  amount: number;
  budgetAmount: number;
}

export class Budget implements BudgetAmounts {
  year: number;
  validity: string;

  incomeAmount: number = 0;
  budgetIncomeAmount: number = 0;
  expenditureAmount: number = 0;
  budgetExpenditureAmount: number = 0;
}

export class BudgetEvent implements BudgetAmounts {
  incomeAmount: number = 0;
  budgetIncomeAmount: number = 0;
  expenditureAmount: number = 0;
  budgetExpenditureAmount: number = 0;

  year?: number;
  items?: BudgetItem[] = [];
  paragraphs?: BudgetParagraph[] = [];
  payments?: BudgetPayment[] = [];
  description: string;

  constructor(
    public id: number,
    public name?: string
  ) {}
}

export class BudgetGroupEvent implements BudgetTypedAmounts {
  amount: number = 0;
  budgetAmount: number = 0;

  items?: BudgetGroupItem[] = [];

  constructor(
    public id: number,
    public name?: string
  ) {}
}

export class BudgetPayment {
  paragraph: number;
  item: number;
  unit: number;
  eventId: number;
  incomeAmount: number;
  expenditureAmount: number;
  date: string;
  counterpartyId: string;
  counterpartyName: string;
  description: string;
}

export class BudgetGroup implements BudgetTypedAmounts {
  amount: number = 0;
  budgetAmount: number = 0;

  constructor(
    public id: string | null,
    public name?: string
  ) {}
}

export class BudgetItem implements BudgetAmounts {
  incomeAmount: number;
  budgetIncomeAmount: number;
  expenditureAmount: number;
  budgetExpenditureAmount: number;

  constructor(
    public id: number,
    public name?: string
  ) {}
}

export class BudgetParagraph implements BudgetAmounts {
  incomeAmount: number;
  budgetIncomeAmount: number;
  expenditureAmount: number;
  budgetExpenditureAmount: number;

  constructor(
    public id: number,
    public name?: string
  ) {}
}

export class BudgetGroupItem implements BudgetTypedAmounts {
  amount: number = 0;
  budgetAmount: number = 0;

  constructor(
    public id: number,
    public name?: string
  ) {}
}
