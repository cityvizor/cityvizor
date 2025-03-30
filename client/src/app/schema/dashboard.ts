export class Dashboard {
  transportation: DashboardItem[] = [];
  schools: DashboardItem[] = [];
  sports: DashboardItem[] = [];
  housing: DashboardItem[] = [];
  culture: DashboardItem[] = [];
  government: DashboardItem[] = [];
}

export interface DashboardRow {
  year: number;
  category:
    | "transportation"
    | "schools"
    | "sports"
    | "housing"
    | "culture"
    | "government";
  amount: number;
  budgetAmount: number;
}

export class DashboardItem {
  year: number;
  amount: number = 0;
  budgetAmount: number = 0;
}
