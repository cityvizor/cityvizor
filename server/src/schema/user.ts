import { ProfileRecord, UserRecord } from "./database";

export interface UserToken {
  id: UserRecord["id"];
  login: string;
  roles: string[];
  managedProfiles: ProfileRecord["id"][];
  tokenCode?: ProfileRecord["tokenCode"];
}