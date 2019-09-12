export interface BudgetYear {
  profileId: number;
  year: number;
  hidden: boolean;
  validity: string;

  status?: string;
  statusTime?: string;
}