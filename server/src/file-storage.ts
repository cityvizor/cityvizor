import { ensureDir } from "fs-extra";
import config from "./config";

const dirs = [
  config.storage.tmp,
  config.storage.avatars,
  config.storage.imports,
];

export async function ensureDirs() {
  for (const dir of dirs) {
    await ensureDir(dir)
      .then(() => console.log("[FS] Initialized dir: " + dir))
      .catch(() => console.error("[FS] Failed to initialize dir: " + dir));
  }
}
