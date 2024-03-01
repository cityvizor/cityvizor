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

function createProfileQueryWithStatusFilter(statuses, tableName: string) {
  const query = db<ProfileRecord>("public.profiles AS " + tableName);
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

function createChildrenCountQuery(statuses) {
  return createProfileQueryWithStatusFilter(statuses, "innerProfile")
    .select("innerProfile.id", db.raw("COUNT(child.id) AS childrenCount"))
    .leftJoin("public.profiles AS child", "innerProfile.id", "child.parent")
    .groupBy("innerProfile.id");
}

function addChildrenCountInnerQuery(query, statuses) {
  const innerQuery = createChildrenCountQuery(statuses).as("counts");
  return query.join(innerQuery, "profile.id", "counts.id");
}

function createProfileIdsWithoutPaymentsQuery() {
  return db("public.profiles AS profiles")
    .select("profiles.id")
    .leftJoin(
      "public.payments AS payments",
      "profiles.id",
      "payments.profile_id"
    )
    .whereNull("payments.profile_id");
}

async function setHasPaymentsFlag(profiles: ProfileRecord | ProfileRecord[]) {
  if (profiles instanceof Array) {
    // Query for multiple profiles
    const result = await createProfileIdsWithoutPaymentsQuery();

    profiles.forEach(
      profile =>
        (profile.hasPayments = !result.some(row => row.id === profile.id))
    );
  } else {
    // Query for single profile
    const anyPayment = await db("payments")
      .first("item")
      .where("profileId", profiles.id);

    profiles.hasPayments = anyPayment != null;
  }
}

/*
Query params: {
  string[] status - filtres profiles by provided statuses
  bool countChildren - if true, for each returned profile counts its children profiles
}
*/
router.get("/", async (req, res) => {
  let profileQuery = createProfileQueryWithStatusFilter(
    req.query.status,
    "profile"
  );

  if (req.query.countChildren) {
    profileQuery = addChildrenCountInnerQuery(profileQuery, req.query.status);
  }

  profileQuery.orderBy("profile.id");

  const profiles = await profileQuery;
  await setHasPaymentsFlag(profiles);

  res.json(profiles);
});

/*
Query params: {
  string[] status - filtres profiles by provided statuses
  bool countChildren - if true, for each returned profile counts its children profiles
}
*/
router.get("/sections", async (req, res) => {
  const sectionQuery = db<SectionRecord>("app.sections AS section");

  let profileQuery = createProfileQueryWithStatusFilter(
    req.query.status,
    "profile"
  );

  if (req.query.countChildren) {
    profileQuery = addChildrenCountInnerQuery(profileQuery, req.query.status);
  }

  profileQuery.orderBy("profile.id");

  const profiles = await profileQuery;
  await setHasPaymentsFlag(profiles);

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
  const parentProfile = await createProfileQueryWithStatusFilter(
    req.query.status,
    "profile"
  )
    .where("profile.id", Number(req.params.id))
    .first();
  if (!parentProfile) return res.sendStatus(404);

  const query = createProfileQueryWithStatusFilter(
    req.query.status,
    "profile"
  ).where("profile.parent", Number(req.params.id));
  let profiles = await query;

  const profileIds = profiles.map(p => Number(p.id));

  const grandchildrenQuery = createProfileQueryWithStatusFilter(
    req.query.status,
    "profile"
  ).whereIn("profile.parent", profileIds);
  const grandchildrenProfiles = await grandchildrenQuery;

  profiles = profiles.concat(grandchildrenProfiles).sort((a, b) => a.id - b.id);

  await setHasPaymentsFlag(profiles);

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

  await setHasPaymentsFlag(profile);

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
