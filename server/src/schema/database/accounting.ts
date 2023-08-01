export interface AccountingRecord {
  profileId: number;
  year: number;

  type: string;
  paragraph: number;
  item: number;
  unit: number;
  event: number;
  amount: number;
}
