import { ProfileRecord } from "./profile";

export interface UserRecord {
  id: number;

  role: string;
  login: string;
  password: string;

  email: string;
  name: string;

  lastLogin: string;
}

export interface UserProfileRecord {
  profileId: ProfileRecord["id"];
  userId: UserRecord["id"];
}
