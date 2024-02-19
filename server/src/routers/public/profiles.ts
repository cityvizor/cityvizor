import express from "express";

import config from "../../config";

import path from "path";

import { db } from "../../db";
import { ProfileRecord } from "../../schema";
import * as fs from "fs";
import { getS3AvatarPublicObjectPath } from "../../s3storage";
import { userManagesProfile } from "../../config/roles";
import { SectionRecord } from "../../schema/database/section";

const router = express.Router();

export const ProfilesRouter = router;

function createQueryWithStatusFilter(statuses, tableName: string) {
  const query = db<ProfileRecord>("profiles AS " + tableName);
  if (statuses) {
    const columnName = tableName + ".status";
    const status = statuses.toString().split(",");
    query.where(function () {
      this.where(columnName, "=", status[0]);
      status.splice(1).map(stat => this.orWhere(columnName, "=", stat));
    });
  }

  query.leftJoin(
    "app.pbo_categories AS category",
    tableName + ".pbo_category_id",
    "category.pbo_category_id"
  );
  return query;
}

function addCountChildrenInnerQuery(query, statuses) {
  const innerQuery = createQueryWithStatusFilter(statuses, "innerProfile")
    .select("innerProfile.id", db.raw("COUNT(child.id) AS childrenCount"))
    .leftJoin("profiles AS child", "innerProfile.id", "child.parent");
  innerQuery.groupBy("innerProfile.id").as("counts");

  query.join(innerQuery, "profile.id", "counts.id");
  return query;
}

/*
Query params: {
  string[] status - filtes profiles by provided statuses
  bool countChildren - if true, for each returned profile counts its children profiles
}
*/
router.get("/", async (req, res) => {
  let profileQuery = createQueryWithStatusFilter(req.query.status, "profile");

  if (req.query.countChildren) {
    profileQuery = addCountChildrenInnerQuery(profileQuery, req.query.status);
  }

  profileQuery.orderBy("profile.id");

  const profiles = await profileQuery;

  res.json(profiles);
});

/*
Query params: {
  string[] status - filtes profiles by provided statuses
  bool countChildren - if true, for each returned profile counts its children profiles
}
*/
router.get("/sections", async (req, res) => {
  const sectionQuery = db<SectionRecord>("app.sections AS section");

  let profileQuery = createQueryWithStatusFilter(req.query.status, "profile");

  if (req.query.countChildren) {
    profileQuery = addCountChildrenInnerQuery(profileQuery, req.query.status);
  }

  profileQuery.orderBy("profile.id");

  const profiles = await profileQuery;
  const sections = await sectionQuery;

  const grouped = {};
  sections.forEach(section => {
    const sectionProfiles = profiles.filter(
      profile => profile.sectionId === section.sectionId
    );

    if (sectionProfiles.length > 0) {
      grouped[section.sectionId] = {
        section,
        profiles: sectionProfiles,
      };
    }
  });

  const result = Object.values(grouped);

  res.json(result);
});

/*
returns children profiles of profile with specified id and grandchildren of these profiles
request: {
  string[] status - filtes profiles by provided statuses
}*/
router.get("/:id/children", async (req, res) => {
  if (!Number(req.params.id)) {
    res.sendStatus(400);
  }
  const parentProfile = await createQueryWithStatusFilter(
    req.query.status,
    "profile"
  )
    .where("profile.id", Number(req.params.id))
    .first();
  if (!parentProfile) return res.sendStatus(404);

  const query = createQueryWithStatusFilter(req.query.status, "profile").where(
    "profile.parent",
    Number(req.params.id)
  );
  let profiles = await query;

  const profileIds = profiles.map(p => Number(p.id));

  const grandchildrenQuery = createQueryWithStatusFilter(
    req.query.status,
    "profile"
  ).whereIn("profile.parent", profileIds);
  const grandchildrenProfiles = await grandchildrenQuery;

  profiles = profiles.concat(grandchildrenProfiles).sort((a, b) => a.id - b.id);

  return res.json({ parent: parentProfile, children: profiles });
});

router.get("/:profile", async (req, res) => {
  const profile: ProfileRecord | null = await db<ProfileRecord>("profiles")
    .modify(function () {
      this.where("url", String(req.params.profile));
      if (!isNaN(Number(req.params.profile))) {
        this.orWhere({ id: Number(req.params.profile) });
      }
    })
    .first();

  if (!profile) {
    return res.sendStatus(404);
  }

  if (profile.status === "hidden") {
    const userRoles = req.user?.roles ?? [];
    const canAccess = userRoles.some(role => {
      return (
        role === "admin" ||
        (role === "profile-admin" && userManagesProfile(req.user, profile.id))
      );
    });

    if (!canAccess) {
      return res.sendStatus(404);
    }
  }

  return res.json(profile);
});

router.get("/:profile/avatar", async (req, res) => {
  const profile = await db<ProfileRecord>("profiles")
    .where("id", Number(req.params.profile))
    .first();

  if (!profile) {
    return res.sendStatus(404);
  }

  if (config.s3.enabled) {
    return res.redirect(
      getS3AvatarPublicObjectPath(profile.id, profile.avatarType, true)
    );
  }

  const avatarPath = path.join(
    config.storage.avatars,
    "avatar_" + req.params.profile + profile.avatarType
  );

  if (!fs.existsSync(avatarPath)) {
    return res.sendStatus(404);
  }

  return res.sendFile(avatarPath);
});
