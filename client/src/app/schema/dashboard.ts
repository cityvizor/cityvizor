export class Dashboard {
  transportation = new DashboardItem();
  schools = new DashboardItem();
  sports = new DashboardItem();
  housing = new DashboardItem();
  culture = new DashboardItem();
  government = new DashboardItem();
}

export interface DashboardRow {
  category: "transportation" | "schools" | "sports" | "housing" | "culture" | "government";
  amount: number;
  budgetAmount: number;
}

export class DashboardItem {
  amount: number = 0;
  budgetAmount: number = 0;
}