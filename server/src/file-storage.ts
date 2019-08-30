const fs = require("fs-extra");
const config = require("./config").default;

const dirs = [  
  config.storage.tmp,
  config.storage.avatars
];

export async function ensureDirs() {
  for (let dir of dirs) {
    await fs.ensureDir(dir)
      .then(() => console.log("[FS] Initialized dir: " + dir))
      .catch(() => console.error("[FS] Failed to initialize dir: " + dir));
  }
}