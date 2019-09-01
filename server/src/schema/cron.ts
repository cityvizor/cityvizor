export interface CronTask {
  id: string;
  name: string;
  exec: () => Promise<any>;
}