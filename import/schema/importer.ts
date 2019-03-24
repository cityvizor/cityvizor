import { ImportedData } from "app/shared/schema";

export interface Importer {
  import(files: { [key: string]: File }, options?: any): Promise<ImportedData>;
}