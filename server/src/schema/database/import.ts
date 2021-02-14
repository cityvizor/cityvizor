import {Import} from "../../worker/import/import";

export interface ImportRecord {
  id: number;
  profileId: number;
  year: number;

  userId: number;

  created: Date;
  started?: Date;
  finished?: Date;

  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;

  validity?: string;
  append: boolean;
  logs?: string;
  format: Import.Format;
  importDir: string;
}
