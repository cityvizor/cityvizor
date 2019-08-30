import { UserInfo } from "os";

import { User } from "./schema/user";

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}