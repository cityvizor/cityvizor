import express, { Request } from "express";
import { sign, SignOptions } from "jsonwebtoken";

import config from "../../config";
import { ProfileRecord } from "../../schema";
import { db } from "../../db";

import acl from "express-dynacl";

const router = express.Router({ mergeParams: true });

export const AdminProfileImportTokenRouter = router;

router.get(
  "/",
  acl("profile-accounting:write"),
  async (req: Request<{ profile: string }>, res) => {
    const profile = await db<ProfileRecord>("app.profiles")
      .select("id", "tokenCode")
      .where("id", req.params.profile)
      .first();

    if (!profile) {
      return res.sendStatus(404);
    }

    // set validity
    const tokenOptions: SignOptions = {
      expiresIn: "2 years",
    };

    const tokenData = {
      roles: ["importer"],
      managedProfiles: [profile.id],
      tokenCode: profile.tokenCode,
    };

    const token = await new Promise((resolve, reject) =>
      sign(tokenData, config.jwt.secret, tokenOptions, (err, _token) =>
        err ? reject(err) : resolve(_token)
      )
    );

    return res.send(token);
  }
);

router.delete("/", async (req: Request<{ profile: string }>, res) => {
  await db<ProfileRecord>("app.profiles")
    .where("id", req.params.profile)
    .increment("tokenCode", 1);
  res.sendStatus(204);
});
