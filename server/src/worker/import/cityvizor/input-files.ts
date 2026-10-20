export interface CityvizorImportFiles {
  dataFile?: string;
  eventsFile?: string;
  paymentsFile?: string;
  accountingFile?: string;
}

export function identifyCityvizorImportFiles(
  dirFiles: string[]
): CityvizorImportFiles {
  return {
    dataFile: dirFiles.find(file => /^.*data.*\.csv/i.test(file)),
    eventsFile: dirFiles.find(file => /^.*events.*\.csv/i.test(file)),
    paymentsFile: dirFiles.find(file => /^.*payments.*\.csv/i.test(file)),
    accountingFile: dirFiles.find(file => /^.*accounting.*\.csv/i.test(file)),
  };
}
