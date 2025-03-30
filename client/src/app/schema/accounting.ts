export type Accounting = AccountingRow[];

export interface AccountingRow {
  year: number;
  type: string;
  paragraph: number;
  item: number;
  unit: number;
  event: number;

  amount: number;
  budgetAmount: number;

  expenditureAmount: number;
  budgetExpenditureAmount: number;
  incomeAmount: number;
  budgetIncomeAmount: number;
}
