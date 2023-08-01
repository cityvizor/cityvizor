export interface NoticeboardRecord {
  profileId: number;

  date: string;
  title: string;
  category: string;

  documentUrl: string;
  edeskyUrl: string;
  previewUrl: string;

  attachments: number;
}
