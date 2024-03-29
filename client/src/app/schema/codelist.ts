import { DateTime } from "luxon";

export type Codelist = CodelistRow[];

export interface CodelistRow {
  id: string;
  name: string;
  description?: string;

  validFrom?: string;
  validTill?: string;

  validFromDate?: DateTime;
  validTillDate?: DateTime;
}
