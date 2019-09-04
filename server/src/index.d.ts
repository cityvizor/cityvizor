import { UserInfo } from "os";

import { UserToken } from "./schema/user";

declare global {
  namespace Express {
    export interface Request {
      user: UserToken;
    }
  }
}