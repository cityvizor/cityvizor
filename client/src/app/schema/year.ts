export interface BudgetYear {
  profileId: number;
  year: number;
  hidden: boolean;
  validity: string;

  importUrl: string;
  importFormat: string;
  importPeriodMinutes: number;

  status?: string;
  statusTime?: string;
}
