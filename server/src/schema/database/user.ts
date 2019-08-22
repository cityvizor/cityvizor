export interface UserRecord {
  "id": number;

  "login": string;
  "password": string;

  "email": string;
  "name": string;
  "organization": string,
}

export interface UserRoleRecord {
  userId: number;
  role: string;
}

export interface UserProfileRecord {
  profileId: number;
  userId: number;
}