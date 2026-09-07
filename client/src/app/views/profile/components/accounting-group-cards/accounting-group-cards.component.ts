import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";

import { BudgetGroup } from "app/schema";
import { MoneyPipe } from "../../../../shared/pipes/money.pipe";

export type AccountingGroupCardsLayout = "grid" | "map" | "bars";
type AccountingGroupMapSize = "small" | "medium" | "large";

@Component({
  selector: "accounting-group-cards",
  templateUrl: "./accounting-group-cards.component.html",
  styleUrls: ["./accounting-group-cards.component.scss"],
  imports: [MoneyPipe],
})
export class AccountingGroupCardsComponent implements OnChanges {
  @Input() groups: BudgetGroup[] = [];
  @Input() selected: string | null = null;
  @Input() layout: AccountingGroupCardsLayout = "grid";

  @Output() select = new EventEmitter<string | null>();

  visibleGroups: BudgetGroup[] = [];
  cardRows: BudgetGroup[][] = [];
  private mapSizes = new Map<BudgetGroup, AccountingGroupMapSize>();
  private mapFlexValues = new Map<BudgetGroup, number>();

  ngOnChanges(): void {
    this.visibleGroups = [...this.groups]
      .filter(group => group.amount !== 0 || group.budgetAmount !== 0)
      .sort(
        (a, b) =>
          b.budgetAmount - a.budgetAmount ||
          b.amount - a.amount ||
          (a.name || "").localeCompare(b.name || ""),
      );
    this.mapSizes = this.getMapSizes(this.visibleGroups);
    this.mapFlexValues = this.getMapFlexValues(this.visibleGroups);
    this.cardRows =
      this.layout === "map"
        ? this.getMapRows(this.visibleGroups)
        : [this.visibleGroups];
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

  getMapSize(group: BudgetGroup): AccountingGroupMapSize {
    return this.mapSizes.get(group) || "medium";
  }

  getMapFlex(group: BudgetGroup): number {
    return this.mapFlexValues.get(group) || 1;
  }

  getGroupIcon(group: BudgetGroup): string {
    const name = (group.name || "").toLocaleLowerCase("cs");
    const iconMappings: [string, string][] = [
      ["samospráv", "fa-landmark"],
      ["státní", "fa-landmark"],
      ["bydlení", "fa-house"],
      ["komunální", "fa-house"],
      ["škol", "fa-graduation-cap"],
      ["vzděláv", "fa-graduation-cap"],
      ["doprav", "fa-bus"],
      ["životní", "fa-leaf"],
      ["zdravot", "fa-heart-pulse"],
      ["kultur", "fa-masks-theater"],
      ["sport", "fa-futbol"],
      ["tělových", "fa-futbol"],
      ["bezpečnost", "fa-shield-halved"],
      ["požární", "fa-fire-extinguisher"],
      ["sociální", "fa-people-roof"],
      ["finanční", "fa-chart-line"],
      ["průmysl", "fa-industry"],
      ["ostatní", "fa-ellipsis"],
    ];

    return (
      iconMappings.find(([part]) => name.includes(part))?.[1] ||
      "fa-chart-pie"
    );
  }

  private getMapSizes(
    groups: BudgetGroup[],
  ): Map<BudgetGroup, AccountingGroupMapSize> {
    const mapSizes = new Map<BudgetGroup, AccountingGroupMapSize>();
    const weights = groups
      .map(group => this.getMapWeight(group))
      .filter(weight => weight > 0)
      .sort((a, b) => a - b);

    if (weights.length === 0) {
      groups.forEach(group => mapSizes.set(group, "medium"));
      return mapSizes;
    }

    // Winsorization prevents one exceptionally large or small group from
    // making all other cards visually indistinguishable.
    const lowerBound = this.getPercentile(weights, 0.15);
    const upperBound = this.getPercentile(weights, 0.85);
    const logarithmicLowerBound = Math.log1p(lowerBound);
    const logarithmicRange =
      Math.log1p(upperBound) - logarithmicLowerBound;

    groups.forEach(group => {
      const weight = Math.min(
        Math.max(this.getMapWeight(group), lowerBound),
        upperBound,
      );
      const normalizedWeight =
        logarithmicRange === 0
          ? 0.5
          : (Math.log1p(weight) - logarithmicLowerBound) / logarithmicRange;

      mapSizes.set(
        group,
        normalizedWeight >= 0.67
          ? "large"
          : normalizedWeight >= 0.34
            ? "medium"
            : "small",
      );
    });

    return mapSizes;
  }

  private getMapWeight(group: BudgetGroup): number {
    return Math.max(
      group.budgetAmount > 0 ? group.budgetAmount : group.amount,
      0,
    );
  }

  private getMapFlexValues(groups: BudgetGroup[]): Map<BudgetGroup, number> {
    const flexValues = new Map<BudgetGroup, number>();
    const weights = groups
      .map(group => this.getMapWeight(group))
      .filter(weight => weight > 0)
      .sort((a, b) => a - b);

    if (weights.length === 0) {
      groups.forEach(group => flexValues.set(group, 1));
      return flexValues;
    }

    const lowerBound = this.getPercentile(weights, 0.15);
    const upperBound = this.getPercentile(weights, 0.85);
    const logarithmicLowerBound = Math.log1p(lowerBound);
    const logarithmicRange =
      Math.log1p(upperBound) - logarithmicLowerBound;

    groups.forEach(group => {
      const weight = Math.min(
        Math.max(this.getMapWeight(group), lowerBound),
        upperBound,
      );
      const normalizedWeight =
        logarithmicRange === 0
          ? 0.5
          : (Math.log1p(weight) - logarithmicLowerBound) / logarithmicRange;

      // A 1:1.65 maximum width ratio keeps labels readable while retaining
      // a clear visual difference between smaller and larger budgets.
      flexValues.set(group, 1 + normalizedWeight * 0.65);
    });

    return flexValues;
  }

  private getMapRows(groups: BudgetGroup[]): BudgetGroup[][] {
    if (groups.length <= 5) return [groups];

    const rows: BudgetGroup[][] = [groups.slice(0, 3)];
    let offset = 3;
    let groupsLeft = groups.length - offset;
    let rowsLeft = Math.ceil(groupsLeft / 6);

    while (groupsLeft > 0) {
      // Later rows contain the smaller budgets, so they never get fewer
      // columns (and therefore more area per card) than the row above them.
      const rowSize = Math.floor(groupsLeft / rowsLeft);
      rows.push(groups.slice(offset, offset + rowSize));
      offset += rowSize;
      groupsLeft -= rowSize;
      rowsLeft--;
    }

    return rows;
  }

  private getPercentile(sortedValues: number[], percentile: number): number {
    const position = (sortedValues.length - 1) * percentile;
    const lowerIndex = Math.floor(position);
    const upperIndex = Math.ceil(position);
    const remainder = position - lowerIndex;

    return (
      sortedValues[lowerIndex] +
      (sortedValues[upperIndex] - sortedValues[lowerIndex]) * remainder
    );
  }
}
