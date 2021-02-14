import {Import} from "../../worker/import/import";

export interface YearRecord {
  profileId: number;
  year: number;
  validity: string;
  hidden?: boolean;
  importUrl?: string;
  importFormat?: Import.Format
  importPeriodMinutes?: number;
}
