import * as fs from "fs-extra";
import path from "path";

const inputFileNames = ["RU.csv", "SK.csv"];

export async function validateInternetStreamInputFiles(
  importDir: string
): Promise<void> {
  const issues: string[] = [];

  for (const fileName of inputFileNames) {
    const filePath = path.join(importDir, fileName);
    let stat;
    try {
      stat = await fs.stat(filePath);
    } catch {
      issues.push(`${fileName} is missing`);
      continue;
    }
    if (!stat.isFile() || stat.size === 0) {
      issues.push(`${fileName} is empty or is not a file`);
    }
  }

  if (issues.length > 0) {
    throw new Error(`Invalid InternetStream input files: ${issues.join("; ")}.`);
  }
}
