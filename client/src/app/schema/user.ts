import { Profile } from "./profile";

/**
 * User object to save data concerning current (or other) user
 */
export interface User {
  id: number;

  login: string;

  role: string;
  managedProfiles: Profile["id"][];

  name: string;
  email: string;
  lastLogin: string;
}

export interface UserToken {
  id: number;
  login: string;
  roles: string[];
  managedProfiles: Profile["id"][];
}
