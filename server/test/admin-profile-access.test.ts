import { Request, Response } from "express";
import acl from "express-dynacl";
import { aclRoles } from "../src/config/roles";
import { db } from "../src/db";
import { AdminProfilesRouter } from "../src/routers/admin/profiles";
import { AdminProfileImportTokenRouter } from "../src/routers/admin/profile-import-token";

jest.mock("../src/db", () => ({ db: jest.fn() }));
jest.mock("../src/config", () => ({ storage: { tmp: "/tmp" } }));

beforeAll(() =>
  acl.config({
    roles: aclRoles,
    userRoles: req => [...(req.user?.roles || [])],
  })
);

it("limits the profile query to assigned IDs while keeping all profiles for admin", async () => {
  for (const [role, managedProfiles] of [
    ["profile-admin", [1]],
    ["profile-admin", []],
    ["admin", []],
  ] as const) {
    const query = { whereIn: jest.fn(), where: jest.fn() };
    (db as unknown as jest.Mock).mockReturnValue({
      modify: fn => {
        fn.call(query);
        return [];
      },
    });
    const req = {
      user: { roles: ["user", role], managedProfiles },
      query: { status: "hidden" },
    } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;
    const route = AdminProfilesRouter.stack.find(
      layer =>
        layer.route?.path === "/" && layer.route.stack[0].method === "get"
    )!.route!;
    const next = jest.fn();
    await route.stack[0].handle(req, res, next);
    expect(next).toHaveBeenCalled();
    await route.stack[1].handle(req, res, next);
    if (role === "admin") expect(query.whereIn).not.toHaveBeenCalled();
    else expect(query.whereIn).toHaveBeenCalledWith("id", managedProfiles);
    expect(query.where).toHaveBeenCalledWith("status", "=", "hidden");
    expect(req.user.roles).toEqual(["user", role]);
  }
});

it("allows profile reads only for assigned profiles or global admin", async () => {
  for (const action of [
    "profiles:read",
    "profile-years:list",
    "profile-years:read",
    "profile-imports:list",
    "profile-accounting:list",
  ]) {
    for (const [role, managedProfiles, allowed] of [
      ["profile-admin", [1], true],
      ["profile-admin", [2], false],
      ["profile-admin", [], false],
      ["admin", [], true],
    ] as const) {
      expect(
        await acl.can(action, {
          user: { roles: [role], managedProfiles },
          params: { profile: "1" },
        })
      ).toBe(allowed);
    }
  }
});

it("protects token revocation from foreign and anonymous requests", async () => {
  const route = AdminProfileImportTokenRouter.stack.find(
    layer => layer.route?.stack[0].method === "delete"
  )!.route!;
  for (const user of [
    undefined,
    { roles: ["profile-admin"], managedProfiles: [2] },
    { roles: ["profile-admin"], managedProfiles: [1] },
    { roles: ["admin"], managedProfiles: [] },
  ]) {
    const next = jest.fn();
    const res = { sendStatus: jest.fn() };
    await route.stack[0].handle(
      { user, params: { profile: "1" } } as unknown as Request,
      res as unknown as Response,
      next
    );
    if (!user || user.managedProfiles.includes(2))
      expect(res.sendStatus).toHaveBeenCalledWith(401);
    else expect(next).toHaveBeenCalled();
  }
});
