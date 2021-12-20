import { Injectable } from '@angular/core';
import { Accounting, BudgetGroup, AccountingRow, BudgetAmounts, BudgetGroupEvent, BudgetTypedAmounts, Profile, ProfileType } from 'app/schema';
import { ProfileComponent } from 'app/views/profile/profile.component';
import { CodelistService } from './codelist.service';
import { DataService } from './data.service';

type AmountField = "expenditureAmount"
                 | "budgetExpenditureAmount"
                 | "incomeAmount"
                 | "budgetIncomeAmount"
                 | "financingAmount"
                 | "budgetFinancingAmount";

export type AccountingGroupType = "exp" | "inc" | "fin";

interface TypeConfig {
  codelistGroup: string,
  codelist: string,
  field: "paragraph" | "item" | "expenditures" | "incomes",
  amount: AmountField,
  budgetAmount: AmountField
}

@Injectable({
  providedIn: 'root'
})
export class AccountingService {
 
  config: { [type in Exclude<ProfileType, "external">]: { [type in AccountingGroupType]: TypeConfig} } = {
    "municipality": {
      "exp": { codelistGroup: "paragraph-groups", codelist: "items", field: "paragraph", amount: "expenditureAmount", budgetAmount: "budgetExpenditureAmount" },
      "inc": { codelistGroup: "item-groups", codelist: "items", field: "item", amount: "incomeAmount", budgetAmount: "budgetIncomeAmount" },
      "fin": { codelistGroup: "item-groups", codelist: "items", field: "item", amount: "financingAmount", budgetAmount: "budgetFinancingAmount" }
    },
    "pbo": {
      "exp": { codelistGroup: "pbo-su-exp-groups", codelist: "pbo-su", field: "expenditures", amount: "expenditureAmount", budgetAmount: "budgetExpenditureAmount" },
      "inc": { codelistGroup: "pbo-su-inc-groups", codelist: "pbo-su", field: "incomes", amount: "incomeAmount", budgetAmount: "budgetIncomeAmount" },
      "fin": { codelistGroup: "item-groups", codelist: "items", field: "item", amount: "financingAmount", budgetAmount: "budgetFinancingAmount" }
    }
  }

  constructor(private codelistService: CodelistService, private dataService: DataService) { }

  async getGroups(profile: Profile, type: AccountingGroupType, year: number): Promise<BudgetGroup[]> {

    const typeConfig = this.config[profile.type][type];

    const groups: BudgetGroup[] = (await this.codelistService.getCurrentCodelist(typeConfig.codelistGroup, new Date(year, 0, 1)))
      .map(group => new BudgetGroup(group.id, group.name));

    const groupIndex = groups.reduce((acc, cur) => (acc[cur.id!] = cur, acc), {} as { [id: string]: BudgetGroup }); // not null bcs "other" group is not present yet

    const other = new BudgetGroup("-1", "Ostatní");

    // HACK
    let accounting: any;
    if (profile.type == 'municipality') {
      accounting = await this.dataService.getProfileAccountingGroups(profile.id, year, typeConfig.field);
    } else {
      accounting = await this.dataService.getProfilePlansGroups(profile.id, year, typeConfig.field)
    }

    for (let row of accounting) {
      const group = groupIndex[row.id] || other;
      group.amount += row[typeConfig.amount];
      group.budgetAmount += row[typeConfig.budgetAmount];
    }

    return other.amount || other.budgetAmount ? [...groups, other] : groups;
  }

  async getGroupEvents(profile: Profile, year: number, type: AccountingGroupType, groupId: string): Promise<BudgetGroupEvent[]> {

    const typeConfig = this.config[profile.type][type];

    const itemCodelist = (await this.codelistService.getCurrentCodelist(typeConfig.codelist, new Date(year, 0, 1)))
      .reduce((acc, cur) => (acc[cur.id] = cur.name, acc), {} as { [id: string]: string })

    // HACK
    let events: BudgetGroupEvent[];
    if (profile.type == 'municipality') {
      events = await this.dataService.getProfileAccountingEvents(profile.id, year, typeConfig.field, groupId)
    } else {
      events = await this.dataService.getProfilePlansDetails(profile.id, year, groupId)
    }
    return events.filter(row => row[typeConfig.amount] || row[typeConfig.budgetAmount])
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

  }

  assignAmounts(item: BudgetAmounts, row: AccountingRow): void {
    item.incomeAmount += row.incomeAmount;
    item.budgetIncomeAmount += row.budgetIncomeAmount;
    item.expenditureAmount += row.expenditureAmount;
    item.budgetExpenditureAmount += row.budgetExpenditureAmount;
    item.financingAmount += row.financingAmount;
    item.budgetFinancingAmount += row.financingAmount;
  }
}
