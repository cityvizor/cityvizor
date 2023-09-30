import {ProfileType} from '../profile-type';

export interface ProfileRecord {
  id: number;

  status: 'visible' | 'pending' | 'hidden';
  type: ProfileType;
  sumMode: 'complete' | 'visible';

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

  pbo_category_id: number | null;
  pbo_category_cs_name: string | null;
  pbo_category_en_name: string | null;

  childrenCount: number | null;

  sectionId: number | null;
}
