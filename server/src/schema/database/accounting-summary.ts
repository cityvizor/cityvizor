export type AccountingSummaryField = "paragraph" | "item";

export interface AccountingSummaryAmounts {
  actualIncomeAmount: number;
  budgetIncomeAmount: number;
  actualExpenditureAmount: number;
  budgetExpenditureAmount: number;
  actualFinancingAmount: number;
  budgetFinancingAmount: number;
}

export interface AccountingYearSummaryRecord extends AccountingSummaryAmounts {
  profileId: number;
  year: number;
  computedAt: Date;
}

export interface AccountingGroupSummaryRecord extends AccountingSummaryAmounts {
  profileId: number;
  year: number;
  field: AccountingSummaryField;
  groupId: string;
  computedAt: Date;
}
