export interface Import {
  id: number;
  profileId: number;
  year: number;

  userId: number;

  created: string;
  started?: string;
  finished?: string;

  status: "pending" | "processing" | "success" | "error";
  error?: string;

  validity?: string;
}