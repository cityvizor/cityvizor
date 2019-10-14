import { Injectable } from '@angular/core';
import { Accounting, BudgetGroup, AccountingRow, BudgetAmounts, BudgetGroupEvent, BudgetTypedAmounts } from 'app/schema';
import { CodelistService } from './codelist.service';
import { DataService } from './data.service';

type AmountField = "expenditureAmount" | "budgetExpenditureAmount" | "incomeAmount" | "budgetIncomeAmount";

export type AccountingGroupType = "exp" | "inc";

interface TypeConfig {
  codelist: string,
  field: "paragraph" | "item",
  amount: AmountField,
  budgetAmount: AmountField
}

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  typeConfig: { [type in AccountingGroupType]: TypeConfig } = {
    "exp": { codelist: "paragraph-groups", field: "paragraph", amount: "expenditureAmount", budgetAmount: "budgetExpenditureAmount" },
    "inc": { codelist: "item-groups", field: "item", amount: "incomeAmount", budgetAmount: "budgetIncomeAmount" }
  };

  constructor(private codelistService: CodelistService, private dataService: DataService) { }

  async getGroups(profileId: number, type: AccountingGroupType, year: number): Promise<BudgetGroup[]> {

    const typeConfig = this.typeConfig[type];

    const groups: BudgetGroup[] = (await this.codelistService.getCurrentCodelist(typeConfig.codelist, new Date(year, 0, 1)))
      .map(group => new BudgetGroup(group.id, group.name));

    const groupIndex = groups.reduce((acc, cur) => (acc[cur.id!] = cur, acc), {} as { [id: string]: BudgetGroup }); // not null bcs "other" group is not present yet

    const other = new BudgetGroup(null, "Ostatní");

    const accounting = await this.dataService.getProfileAccountingGroups(profileId, year, typeConfig.field);

    for (let row of accounting) {
      const group = groupIndex[row.id] || other;
      group.amount = row[typeConfig.amount];
      group.budgetAmount = row[typeConfig.budgetAmount];
    }

    return other.amount || other.budgetAmount ? [...groups, other] : groups;
  }

  async getGroupEvents(profileId: number, year: number, type: AccountingGroupType, groupId: string): Promise<BudgetGroupEvent[]> {

    const typeConfig = this.typeConfig[type];

    const itemCodelist = (await this.codelistService.getCurrentCodelist("items", new Date(year, 0, 1)))
      .reduce((acc, cur) => (acc[cur.id] = cur.name, acc), {} as { [id: string]: string })

    const events: BudgetGroupEvent[] = (await this.dataService.getProfileAccountingEvents(profileId, year, typeConfig.field, groupId))
      .filter(row => row[typeConfig.amount] || row[typeConfig.budgetAmount])
      .map(row => {

        const event: BudgetGroupEvent = {
          id: row.id,
          name: row.name,
          amount: row[typeConfig.amount],
          budgetAmount: row[typeConfig.budgetAmount],
          items: []
        };

        if (row.items) event.items = row.items
          .filter(row => row[typeConfig.amount] || row[typeConfig.budgetAmount])
          .map(item => ({
            id: item.id,
            name: itemCodelist[String(item.id)],
            amount: item[typeConfig.amount],
            budgetAmount: item[typeConfig.budgetAmount]
          }))
          .sort((a, b) => b.budgetAmount - a.budgetAmount)

        return event;
      });

    return events;
  }

  assignAmounts(item: BudgetAmounts, row: AccountingRow): void {
    item.incomeAmount += row.incomeAmount;
    item.budgetIncomeAmount += row.budgetIncomeAmount;
    item.expenditureAmount += row.expenditureAmount;
    item.budgetExpenditureAmount += row.budgetExpenditureAmount;
  }

  assignTypedAmounts(item: BudgetTypedAmounts, row: AccountingRow, type: AccountingGroupType): void {
    const typeConfig = this.typeConfig[type];
    item.amount += row[typeConfig.amount];
    item.budgetAmount += row[typeConfig.budgetAmount];
  }
}
