let logs: string[] = [];
export default {
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
