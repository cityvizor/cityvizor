export const accountingRules = {
  internalTransfers: {
    // Own accounts transfers only
    incomeItems: [4133, 4134, 4138, 4139] as readonly number[],
    expenditureItems: [5342, 5344, 5345, 5348, 5349] as readonly number[],
  },
} as const;
