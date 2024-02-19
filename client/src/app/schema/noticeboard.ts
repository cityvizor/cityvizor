export type Noticeboard = NoticeboardRow[];

export interface NoticeboardRow {
  profileId: number;

  date: string;
  title: string;
  category: string;

  documentUrl: string;
  edeskyUrl: string;
  previewUrl: string;
}
