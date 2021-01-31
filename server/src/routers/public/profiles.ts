import express from 'express';

import config from "../../config";

import path from "path";

import {db} from "../../db";
import {ProfileRecord} from '../../schema';

const router = express.Router();

export const ProfilesRouter = router;

router.get("/", async (req, res, next) => {

    const profiles = await db<ProfileRecord>("profiles")
        .modify(function () {
            if (req.params.status) {
                this.where('status', req.params.status);
            }
        });

    res.json(profiles);

});

router.get("/main", async (req, res) => {

    const profile = await db<ProfileRecord>("profiles")
        .where({main: true})
        .first()

    if (!profile) return res.sendStatus(404);
    res.json(profile);
});

router.get("/:profile", async (req, res) => {

    const profile = await db<ProfileRecord>("profiles")
        .modify(function () {
            this.where('url', String(req.params.profile))
            if (!isNaN(Number(req.params.profile))) this.orWhere({id: Number(req.params.profile)})
        })
        .first()

    if (!profile) return res.sendStatus(404);
    res.json(profile);
});

router.get("/:profile/avatar", async (req, res, next) => {
    let profile = await db<ProfileRecord>("profiles")
        .where('id', Number(req.params.profile))
        .first();

    if (!profile) return res.sendStatus(404);

    const avatarPath = path.join(config.storage.avatars, "avatar_" + req.params.profile + profile.avatarType);

    res.sendFile(avatarPath)

});
