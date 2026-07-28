import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";

import { BudgetGroup } from "app/schema";
import { MoneyPipe } from "../../../../shared/pipes/money.pipe";

@Component({
  selector: "accounting-group-cards",
  templateUrl: "./accounting-group-cards.component.html",
  styleUrls: ["./accounting-group-cards.component.scss"],
  imports: [MoneyPipe],
})
export class AccountingGroupCardsComponent implements OnChanges {
  @Input() groups: BudgetGroup[] = [];
  @Input() selected: string | null = null;

  @Output() select = new EventEmitter<string | null>();

  visibleGroups: BudgetGroup[] = [];

  ngOnChanges(): void {
    this.visibleGroups = [...this.groups]
      .filter(group => group.amount !== 0 || group.budgetAmount !== 0)
      .sort(
        (a, b) =>
          b.budgetAmount - a.budgetAmount ||
          b.amount - a.amount ||
          (a.name || "").localeCompare(b.name || ""),
      );
  }

  selectGroup(group: BudgetGroup): void {
    if (group.id === null) return;

    this.select.emit(group.id === this.selected ? null : group.id);
  }

  getProgress(group: BudgetGroup): number {
    if (!this.hasProgress(group)) return 0;

    return Math.min(
      Math.max((group.amount / group.budgetAmount) * 100, 0),
      100,
    );
  }

  getPercentage(group: BudgetGroup): string {
    if (!this.hasProgress(group)) return "—";

    const percentage =
      Math.round((group.amount / group.budgetAmount) * 1000) / 10;
    return `${String(percentage).replace(".", ",")} %`;
  }

  hasProgress(group: BudgetGroup): boolean {
    return group.budgetAmount > 0 && group.amount >= 0;
  }

  isOverBudget(group: BudgetGroup): boolean {
    return group.budgetAmount >= 0 && group.amount > group.budgetAmount;
  }

  getProgressStatus(group: BudgetGroup): string {
    if (group.budgetAmount === 0 && group.amount > 0)
      return "Čerpáno bez rozpočtu";

    return "Čerpání nelze vyjádřit procentem";
  }

  getAriaLabel(group: BudgetGroup): string {
    const name = group.name || "Nezařazená skupina";

    if (group.id === null) return `${name}: detail není k dispozici`;
    if (group.id === this.selected) return `Skrýt detail skupiny ${name}`;
    return `Zobrazit detail skupiny ${name}`;
  }
}
