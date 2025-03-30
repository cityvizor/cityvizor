let logs: string[] = [];
export const importLogger = {
  log(s: string) {
    logs.push(s);
  },

  clear() {
    logs = [];
  },

  getLogs(): string {
    return logs.join("\n");
  },
};
