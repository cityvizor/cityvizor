import { ProfileType } from '../profile-type';

export interface ProfileRecord {
  id: number;

  status: 'visible' | 'pending' | 'hidden';
  type: ProfileType;
  sumMode: 'complete' | 'visible';
  category: {
    cs: string,
    en: string
  }
  main: boolean;

  url: string;
  name: string;
  email: string;
  avatarType: string | null;
  avatarUrl?: string;

  ico: string;
  databox: string;
  edesky: number;
  parent: number | null;
  mapasamospravy: number;
  gpsX: number;
  gpsY: number;

  tokenCode: number;
}

export interface ProfileRecordWithChildrenCount extends ProfileRecord {
  childrenCount: number
}