export type Dashboard = DashboardRow[];

export interface DashboardRow {
  category: string;
  amount: number;
  budgetAmount: number;
}