import express from 'express';

import config from "../config";
import multer from 'multer';

import mime from 'mime-types';
import fs from "fs-extra";
import path from "path";
import acl from "express-dynacl";

import { db } from "../db";
import { ProfileRecord } from '../schema/database';

export const router = express.Router();

const upload = multer({ dest: config.storage.tmp });

var profileSchema = {
  type: "object",
  properties: {
    "sort": { type: "string" },
    "fields": { type: "string" },
    "hidden": { type: "string" }
  }
};
router.get("/", acl("profiles", "list"), async (req, res, next) => {

  if (req.query.hidden) {
    const profiles = await db<ProfileRecord>("app.profiles").select("id", "hidden", "name", "url", "gpsX", "gpsY");
    res.json(profiles);
  }
  else {
    const profiles = await db<ProfileRecord>("profiles").select("id", "name", "url", "gpsX", "gpsY");
    res.json(profiles);
  }

});

router.get("/main", acl("profiles", "read"), async (req, res) => {

  const profile = await db<ProfileRecord>("app.profiles")
    .where({main: true})
    .first()

  if (!profile) return res.sendStatus(404);
  res.json(profile);
});

router.get("/:profile", acl("profiles", "read"), async (req, res) => {

  const profile = await db<ProfileRecord>("app.profiles")
    .modify(function () {
      this.where({ url: String(req.params.profile) })
      if (!isNaN(Number(req.params.profile))) this.orWhere({ id: Number(req.params.profile) })
    })
    .first()

  if (!profile) return res.sendStatus(404);
  res.json(profile);
});

router.post("/", acl("profiles", "write"), async (req, res) => {

  const id = await db<ProfileRecord>("app.profiles")
    .insert(req.body, ["id"])
    .then(result => result[0].id);

  res.location("/profiles/" + id);

  res.sendStatus(201);
});

router.patch("/:profile", acl("profiles", "write"), async (req, res, next) => {

  await db("app.profiles")
    .where({ id: req.params.profile })
    .update(req.body);

  res.sendStatus(204);
});

router.delete("/:profile", acl("profiles", "write"), async (req, res, next) => {
  await db("app.profiles")
    .where({ id: req.params.profile })
    .delete();
  res.sendStatus(204);
});
router.get("/:profile/avatar", acl("profile-image", "read"), async (req, res, next) => {

  const profile = await db<ProfileRecord>("profiles")
    .where({ id: req.params.profile })
    .first();

  res.json(profile);

});

router.put("/:profile/avatar", upload.single("avatar"), acl("profile-image", "write"), function (req, res, next) {
  /* TODO

  if (!req.file)
    return res.status(400).send("Missing file.");
  var allowedTypes = [".png", ".jpg", ".jpe", ".gif", ".svg"];
  var extname = path.extname(req.file.originalname).toLowerCase();
  if (allowedTypes.indexOf(extname) === -1)
    return res.status(400).send("Allowed file types are: " + allowedTypes.join(", "));
  var data = {
    avatar: {
      data: fs.readFileSync(req.file.path),
      mimeType: mime.lookup(req.file.originalname) || null,
      name: req.file.originalname
    }
  };
  Profile.findOneAndUpdate({ _id: req.params.profile }, data)
    .then(function (profile) { return res.sendStatus(200); })
    .catch(function (err) { return next(err); });
    */
});

router.delete("/:profile/avatar", acl("profile-image", "write"), function (req, res, next) {
  /* TODO
 Profile.findOneAndUpdate({ _id: req.params.profile }, { avatar: null })
   .then(function (profile) { return res.sendStatus(200); })
   .catch(function (err) { return next(err); });
   */

});
