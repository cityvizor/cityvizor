export const aclConfig = {

  routes: [
    {
      route: "/admin/spravci",
      allowRoles: ["admin"]
    },
    {
      route: "/admin",
      allowRoles: ["admin", "profile-admin"]
    },
    {
      route: "/ucet",
      allowRoles: ["admin", "user"]
    }
  ],
  
  default: {
    allow: true
  }

}